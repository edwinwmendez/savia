/**
 * SAVIA - Cloud Functions
 * Sistema de Alertas Vecinales Integrado de Atalaya
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Inicializar Firebase Admin
admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

// ============ TIPOS ============

interface AlertData {
  type: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  urgency: "critical" | "high" | "medium" | "low";
  status: "pending" | "assigned" | "in_progress" | "resolved" | "cancelled";
  createdBy: string;
  assignedTo?: string;
  assignedInstitution?: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dni: string;
  role: "citizen" | "operator" | "admin";
  institutionId?: string;
  fcmToken?: string;
  isActive: boolean;
}

interface RegisterCitizenData {
  dni: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

// ============ TRIGGER: Nueva Alerta Creada ============

export const onAlertCreated = functions.firestore
  .document("alerts/{alertId}")
  .onCreate(async (snapshot, context) => {
    const alertData = snapshot.data() as AlertData;
    const alertId = context.params.alertId;

    try {
      // Obtener operadores activos de la institución correspondiente
      const operatorsSnapshot = await db
        .collection("users")
        .where("role", "==", "operator")
        .where("isActive", "==", true)
        .get();

      if (operatorsSnapshot.empty) {
        console.log("No hay operadores activos disponibles");
        return;
      }

      // Recopilar tokens FCM de operadores
      const tokens: string[] = [];
      operatorsSnapshot.forEach((doc) => {
        const userData = doc.data() as UserData;
        if (userData.fcmToken) {
          tokens.push(userData.fcmToken);
        }
      });

      if (tokens.length === 0) {
        console.log("Ningún operador tiene token FCM registrado");
        return;
      }

      // Preparar notificación
      const urgencyLabels = {
        critical: "CRÍTICA",
        high: "Alta",
        medium: "Media",
        low: "Baja",
      };

      const notification = {
        title: `Nueva Alerta - ${urgencyLabels[alertData.urgency]}`,
        body: `${alertData.type}: ${alertData.description.substring(0, 100)}...`,
      };

      // Enviar notificación a todos los operadores
      const message: admin.messaging.MulticastMessage = {
        tokens,
        notification,
        data: {
          alertId,
          type: alertData.type,
          urgency: alertData.urgency,
          click_action: "OPEN_ALERT_DETAIL",
        },
        android: {
          priority: alertData.urgency === "critical" ? "high" : "normal",
          notification: {
            channelId: "alerts",
            priority: alertData.urgency === "critical" ? "max" : "high",
          },
        },
        apns: {
          payload: {
            aps: {
              sound: alertData.urgency === "critical" ? "critical.wav" : "default",
              badge: 1,
            },
          },
        },
      };

      const response = await messaging.sendEachForMulticast(message);
      console.log(
        `Notificaciones enviadas: ${response.successCount} exitosas, ${response.failureCount} fallidas`
      );

      // Crear registro de notificación en Firestore para cada operador
      const batch = db.batch();
      operatorsSnapshot.forEach((doc) => {
        const notificationRef = db.collection("notifications").doc();
        batch.set(notificationRef, {
          userId: doc.id,
          type: "new_alert",
          title: notification.title,
          body: notification.body,
          alertId,
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });
      await batch.commit();
    } catch (error) {
      console.error("Error al procesar nueva alerta:", error);
    }
  });

// ============ TRIGGER: Alerta Actualizada ============

export const onAlertUpdated = functions.firestore
  .document("alerts/{alertId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data() as AlertData;
    const after = change.after.data() as AlertData;
    const alertId = context.params.alertId;

    // Solo notificar si cambió el estado
    if (before.status === after.status) {
      return;
    }

    try {
      // Obtener datos del ciudadano que creó la alerta
      const citizenDoc = await db.collection("users").doc(after.createdBy).get();
      if (!citizenDoc.exists) {
        console.log("Ciudadano no encontrado");
        return;
      }

      const citizenData = citizenDoc.data() as UserData;
      if (!citizenData.fcmToken) {
        console.log("Ciudadano no tiene token FCM");
        return;
      }

      // Preparar mensaje según el nuevo estado
      const statusMessages: Record<string, { title: string; body: string }> = {
        assigned: {
          title: "Alerta Asignada",
          body: "Un operador ha tomado tu caso y está en camino.",
        },
        in_progress: {
          title: "Alerta en Progreso",
          body: "Tu alerta está siendo atendida en este momento.",
        },
        resolved: {
          title: "Alerta Resuelta",
          body: "Tu alerta ha sido resuelta. ¡Gracias por usar SAVIA!",
        },
        cancelled: {
          title: "Alerta Cancelada",
          body: "Tu alerta ha sido cancelada.",
        },
      };

      const messageContent = statusMessages[after.status];
      if (!messageContent) {
        return;
      }

      // Enviar notificación al ciudadano
      const message: admin.messaging.Message = {
        token: citizenData.fcmToken,
        notification: messageContent,
        data: {
          alertId,
          newStatus: after.status,
          click_action: "OPEN_ALERT_DETAIL",
        },
      };

      await messaging.send(message);
      console.log(`Notificación de cambio de estado enviada al ciudadano ${after.createdBy}`);

      // Crear registro de notificación
      await db.collection("notifications").add({
        userId: after.createdBy,
        type: "status_change",
        title: messageContent.title,
        body: messageContent.body,
        alertId,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error("Error al notificar cambio de estado:", error);
    }
  });

// ============ FUNCIÓN: Registrar Ciudadano ============

export const registerCitizen = functions.https.onCall(
  async (request: functions.https.CallableRequest<RegisterCitizenData>) => {
    const { dni, firstName, lastName, phone, email, password } = request.data;

    // Validar datos requeridos
    if (!dni || !firstName || !lastName || !phone || !email || !password) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Todos los campos son requeridos"
      );
    }

    // Validar formato de DNI (8 dígitos)
    if (!/^\d{8}$/.test(dni)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "El DNI debe tener 8 dígitos"
      );
    }

    // Validar formato de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "El email no es válido"
      );
    }

    // Validar contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "La contraseña debe tener al menos 6 caracteres"
      );
    }

    try {
      // Verificar si el DNI ya está registrado
      const existingUser = await db
        .collection("users")
        .where("dni", "==", dni)
        .get();

      if (!existingUser.empty) {
        throw new functions.https.HttpsError(
          "already-exists",
          "Este DNI ya está registrado"
        );
      }

      // Crear usuario en Firebase Auth
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
      });

      // Crear documento de usuario en Firestore
      await db.collection("users").doc(userRecord.uid).set({
        dni,
        firstName,
        lastName,
        phone,
        email,
        role: "citizen",
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Asignar custom claims
      await admin.auth().setCustomUserClaims(userRecord.uid, {
        role: "citizen",
      });

      return {
        success: true,
        uid: userRecord.uid,
        message: "Usuario registrado exitosamente",
      };
    } catch (error) {
      console.error("Error al registrar ciudadano:", error);

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      const firebaseError = error as { code?: string };
      if (firebaseError.code === "auth/email-already-exists") {
        throw new functions.https.HttpsError(
          "already-exists",
          "Este email ya está registrado"
        );
      }

      throw new functions.https.HttpsError(
        "internal",
        "Error al registrar usuario"
      );
    }
  }
);

// ============ FUNCIÓN: Obtener Estadísticas del Dashboard ============

export const getDashboardStats = functions.https.onCall(
  async (request: functions.https.CallableRequest) => {
    // Verificar autenticación
    if (!request.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Debe estar autenticado"
      );
    }

    // Verificar rol de admin
    const userDoc = await db.collection("users").doc(request.auth.uid).get();
    const userData = userDoc.data() as UserData;

    if (userData?.role !== "admin") {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Solo administradores pueden acceder"
      );
    }

    try {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Contar alertas por estado
      const [
        totalAlerts,
        pendingAlerts,
        inProgressAlerts,
        resolvedAlerts,
        todayAlerts,
        monthAlerts,
      ] = await Promise.all([
        db.collection("alerts").count().get(),
        db.collection("alerts").where("status", "==", "pending").count().get(),
        db.collection("alerts").where("status", "==", "in_progress").count().get(),
        db.collection("alerts").where("status", "==", "resolved").count().get(),
        db
          .collection("alerts")
          .where("createdAt", ">=", startOfToday)
          .count()
          .get(),
        db
          .collection("alerts")
          .where("createdAt", ">=", startOfMonth)
          .count()
          .get(),
      ]);

      // Contar usuarios
      const [totalUsers, activeOperators] = await Promise.all([
        db.collection("users").where("role", "==", "citizen").count().get(),
        db
          .collection("users")
          .where("role", "==", "operator")
          .where("isActive", "==", true)
          .count()
          .get(),
      ]);

      return {
        alerts: {
          total: totalAlerts.data().count,
          pending: pendingAlerts.data().count,
          inProgress: inProgressAlerts.data().count,
          resolved: resolvedAlerts.data().count,
          today: todayAlerts.data().count,
          thisMonth: monthAlerts.data().count,
        },
        users: {
          totalCitizens: totalUsers.data().count,
          activeOperators: activeOperators.data().count,
        },
      };
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Error al obtener estadísticas"
      );
    }
  }
);
