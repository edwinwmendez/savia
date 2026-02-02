/**
 * SAVIA - Cloud Functions
 * Sistema de Alertas Vecinales Integrado de Atalaya
 */

import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { sendPushToOne, sendPushToMany } from "./pushService";

// Inicializar Firebase Admin
admin.initializeApp();

const db = admin.firestore();

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
  role: "citizen" | "agent" | "admin";
  institutionId?: string;
  expoPushToken?: string;
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

export const onAlertCreated = onDocumentCreated("alerts/{alertId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const alertData = snapshot.data() as AlertData;
  const alertId = event.params.alertId;

  try {
    // Obtener agentes activos de la institución correspondiente
    const agentsSnapshot = await db
      .collection("users")
      .where("role", "==", "agent")
      .where("isActive", "==", true)
      .get();

    if (agentsSnapshot.empty) {
      console.log("No hay agentes activos disponibles");
      return;
    }

    // Recopilar tokens Expo de agentes (excluir al creador de la alerta)
    const tokens: string[] = [];
    const agentIds: string[] = [];
    agentsSnapshot.forEach((doc) => {
      if (doc.id === alertData.createdBy) return;
      const userData = doc.data() as UserData;
      if (userData.expoPushToken) {
        tokens.push(userData.expoPushToken);
        agentIds.push(doc.id);
      }
    });

    if (tokens.length === 0) {
      console.log("[Push] Ningun agente tiene token Expo registrado");
      return;
    }

    // Preparar notificacion
    const urgencyLabels = {
      critical: "CRITICA",
      high: "Alta",
      medium: "Media",
      low: "Baja",
    };

    const notification = {
      title: `Nueva Alerta - ${urgencyLabels[alertData.urgency]}`,
      body: `${alertData.type}: ${alertData.description.substring(0, 100)}...`,
    };

    // Enviar notificacion push a todos los agentes via Expo
    await sendPushToMany(tokens, notification.title, notification.body, {
      alertId,
      type: alertData.type,
      urgency: alertData.urgency,
    });

    // Crear registro de notificación en Firestore para cada agente
    const batch = db.batch();
    agentIds.forEach((agentId) => {
      const notificationRef = db.collection("notifications").doc();
      batch.set(notificationRef, {
        userId: agentId,
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

export const onAlertUpdated = onDocumentUpdated("alerts/{alertId}", async (event) => {
  const change = event.data;
  if (!change) return;

  const before = change.before.data() as AlertData;
  const after = change.after.data() as AlertData;
  const alertId = event.params.alertId;

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
    if (!citizenData.expoPushToken) {
      console.log("[Push] Ciudadano no tiene token Expo");
      return;
    }

    // Preparar mensaje según el nuevo estado
    const statusMessages: Record<string, { title: string; body: string }> = {
      assigned: {
        title: "Alerta Asignada",
        body: "Un agente ha tomado tu caso y está en camino.",
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

    // Enviar notificacion push al ciudadano via Expo
    await sendPushToOne(citizenData.expoPushToken, messageContent.title, messageContent.body, {
      alertId,
      newStatus: after.status,
    });
    console.log(`[Push] Notificacion de cambio de estado enviada al ciudadano ${after.createdBy}`);

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

export const registerCitizen = onCall<RegisterCitizenData>(
  { invoker: "public" },
  async (request) => {
  const { dni, firstName, lastName, phone, email, password } = request.data;

  // Validar datos requeridos
  if (!dni || !firstName || !lastName || !phone || !email || !password) {
    throw new HttpsError(
      "invalid-argument",
      "Todos los campos son requeridos"
    );
  }

  // Validar formato de DNI (8 dígitos)
  if (!/^\d{8}$/.test(dni)) {
    throw new HttpsError(
      "invalid-argument",
      "El DNI debe tener 8 dígitos"
    );
  }

  // Validar formato de email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpsError(
      "invalid-argument",
      "El email no es válido"
    );
  }

  // Validar contraseña (mínimo 8 caracteres - RN-003)
  if (password.length < 8) {
    throw new HttpsError(
      "invalid-argument",
      "La contraseña debe tener al menos 8 caracteres"
    );
  }

  try {
    // Verificar si el DNI ya está registrado
    const existingUser = await db
      .collection("users")
      .where("dni", "==", dni)
      .get();

    if (!existingUser.empty) {
      throw new HttpsError(
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

    if (error instanceof HttpsError) {
      throw error;
    }

    const firebaseError = error as { code?: string };
    if (firebaseError.code === "auth/email-already-exists") {
      throw new HttpsError(
        "already-exists",
        "Este email ya está registrado"
      );
    }

    throw new HttpsError(
      "internal",
      "Error al registrar usuario"
    );
  }
});

// ============ FUNCIÓN: Crear Alerta ============

interface CreateAlertInput {
  type: string;
  categoryName: string;
  description: string;
  urgency: "critical" | "high" | "medium" | "low";
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  imageUrls: string[];
}

export const createAlert = onCall<CreateAlertInput>(
  { invoker: "public" },
  async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debe estar autenticado");
  }

  const userDoc = await db.collection("users").doc(request.auth.uid).get();
  const userData = userDoc.data() as UserData;

  if (userData?.role !== "citizen") {
    throw new HttpsError("permission-denied", "Solo ciudadanos pueden crear alertas");
  }

  const { type, categoryName, description, urgency, location, address, imageUrls } = request.data;

  if (!type || !description || !urgency || !location?.latitude || !location?.longitude) {
    throw new HttpsError("invalid-argument", "Datos incompletos para crear la alerta");
  }

  if (description.length > 500) {
    throw new HttpsError("invalid-argument", "La descripción no puede exceder 500 caracteres");
  }

  const validUrgencies = ["low", "medium", "high", "critical"];
  if (!validUrgencies.includes(urgency)) {
    throw new HttpsError("invalid-argument", "Nivel de urgencia inválido");
  }

  try {
    // Generar código de alerta ALT-YYYY-NNNN con transacción
    const year = new Date().getFullYear();
    const counterRef = db.collection("counters").doc("alerts");

    const alertCode = await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      const currentCount = counterDoc.exists ? (counterDoc.data()?.count ?? 0) : 0;
      const nextCount = currentCount + 1;
      transaction.set(counterRef, { count: nextCount }, { merge: true });
      return `ALT-${year}-${String(nextCount).padStart(4, "0")}`;
    });

    // Crear documento de alerta
    const alertRef = db.collection("alerts").doc();
    const alertData = {
      type,
      categoryName,
      description,
      urgency,
      status: "pending",
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        address,
      },
      address,
      imageUrls: imageUrls || [],
      createdBy: request.auth.uid,
      alertCode,
      statusHistory: [
        { status: "pending", timestamp: admin.firestore.Timestamp.now() },
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await alertRef.set(alertData);
    console.log(`[Alerts] Alerta creada: ${alertCode} (${alertRef.id}) por ${request.auth.uid}`);

    return {
      success: true,
      alertId: alertRef.id,
      alertCode,
    };
  } catch (error) {
    console.error("[Alerts] Error al crear alerta:", error);
    if (error instanceof HttpsError) throw error;
    const msg = error instanceof Error ? error.message : "Error desconocido";
    throw new HttpsError("internal", `Error al crear la alerta: ${msg}`);
  }
});

// ============ FUNCIÓN: Obtener Estadísticas del Dashboard ============

export const getDashboardStats = onCall(async (request) => {
  // Verificar autenticación
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Debe estar autenticado"
    );
  }

  // Verificar rol de admin
  const userDoc = await db.collection("users").doc(request.auth.uid).get();
  const userData = userDoc.data() as UserData;

  if (userData?.role !== "admin") {
    throw new HttpsError(
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
    const [totalUsers, activeAgents] = await Promise.all([
      db.collection("users").where("role", "==", "citizen").count().get(),
      db
        .collection("users")
        .where("role", "==", "agent")
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
        activeAgents: activeAgents.data().count,
      },
    };
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    throw new HttpsError(
      "internal",
      "Error al obtener estadísticas"
    );
  }
});

// ============ FUNCIÓN: Crear Usuario (Admin) ============

interface CreateUserData {
  dni: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: "citizen" | "agent" | "admin";
  institutionId?: string;
  sendCredentials?: boolean;
}

export const createUser = onCall<CreateUserData>(
  { invoker: "public" },
  async (request) => {
  // Verificar autenticación
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debe estar autenticado");
  }

  // Verificar rol admin
  const adminDoc = await db.collection("users").doc(request.auth.uid).get();
  const adminData = adminDoc.data() as UserData;

  if (adminData?.role !== "admin") {
    throw new HttpsError("permission-denied", "Solo administradores pueden crear usuarios");
  }

  const { dni, firstName, lastName, phone, email, role, institutionId } = request.data;

  // Validar datos requeridos
  if (!dni || !firstName || !lastName || !phone || !email || !role) {
    throw new HttpsError("invalid-argument", "Todos los campos son requeridos");
  }

  // Validar formato de DNI (8 dígitos)
  if (!/^\d{8}$/.test(dni)) {
    throw new HttpsError("invalid-argument", "El DNI debe tener 8 dígitos");
  }

  // Validar formato de email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpsError("invalid-argument", "El email no es válido");
  }

  // Validar rol
  const validRoles = ["citizen", "agent", "admin"];
  if (!validRoles.includes(role)) {
    throw new HttpsError("invalid-argument", "Rol inválido");
  }

  try {
    // Verificar si el DNI ya está registrado
    const existingUser = await db
      .collection("users")
      .where("dni", "==", dni)
      .get();

    if (!existingUser.empty) {
      throw new HttpsError("already-exists", "Este DNI ya está registrado");
    }

    // Generar contraseña temporal
    const tempPassword = `Savia${dni.slice(-4)}!`;

    // Crear usuario en Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password: tempPassword,
      displayName: `${firstName} ${lastName}`,
    });

    // Crear documento en Firestore
    const userData: Record<string, unknown> = {
      dni,
      firstName,
      lastName,
      phone,
      email,
      role,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (institutionId) {
      userData.institutionId = institutionId;
    }

    await db.collection("users").doc(userRecord.uid).set(userData);

    // Asignar custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    console.log(`[CreateUser] Usuario creado: ${userRecord.uid} (${role}) por admin ${request.auth.uid}`);

    return {
      success: true,
      uid: userRecord.uid,
      message: "Usuario creado exitosamente",
    };
  } catch (error) {
    console.error("[CreateUser] Error:", error);

    if (error instanceof HttpsError) {
      throw error;
    }

    const firebaseError = error as { code?: string };
    if (firebaseError.code === "auth/email-already-exists") {
      throw new HttpsError("already-exists", "Este email ya está registrado");
    }

    throw new HttpsError("internal", "Error al crear usuario");
  }
});

// ============ FUNCIÓN: Agente Toma una Alerta ============

interface TakeAlertInput {
  alertId: string;
}

export const takeAlert = onCall<TakeAlertInput>(
  { invoker: "public" },
  async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debe estar autenticado");
  }

  const uid = request.auth.uid;
  const { alertId } = request.data;

  if (!alertId) {
    throw new HttpsError("invalid-argument", "El ID de la alerta es requerido");
  }

  console.log(`[TakeAlert] Agente ${uid} intentando tomar alerta ${alertId}`);

  try {
    await db.runTransaction(async (transaction) => {
      // 1. Leer el documento de la alerta
      const alertRef = db.collection("alerts").doc(alertId);
      const alertDoc = await transaction.get(alertRef);

      if (!alertDoc.exists) {
        throw new HttpsError("not-found", "La alerta no existe");
      }

      const alertData = alertDoc.data() as AlertData;

      // 2. Validar que la alerta está pendiente
      if (alertData.status !== "pending") {
        throw new HttpsError(
          "failed-precondition",
          "Esta alerta ya fue tomada por otro agente"
        );
      }

      // 3. Leer el documento del agente
      const agentRef = db.collection("users").doc(uid);
      const agentDoc = await transaction.get(agentRef);

      if (!agentDoc.exists) {
        throw new HttpsError("not-found", "Usuario agente no encontrado");
      }

      const agentData = agentDoc.data() as UserData;

      if (agentData.role !== "agent") {
        throw new HttpsError("permission-denied", "Solo agentes pueden tomar alertas");
      }

      if (!agentData.isActive) {
        throw new HttpsError("permission-denied", "La cuenta del agente no está activa");
      }

      // 4. Obtener nombre de la institución
      const agentName = `${agentData.firstName} ${agentData.lastName}`;
      let institutionName: string | null = null;
      if (agentData.institutionId) {
        const instDoc = await transaction.get(
          db.collection("institutions").doc(agentData.institutionId)
        );
        institutionName = instDoc.exists
          ? (instDoc.data() as { name?: string }).name || agentData.institutionId
          : agentData.institutionId;
      }

      console.log(`[TakeAlert] Agente ${agentName} (${uid}) asignado a alerta ${alertId}`);

      // 5. Actualizar la alerta
      transaction.update(alertRef, {
        status: "assigned",
        assignedTo: uid,
        assignedAgentName: agentName,
        assignedInstitution: agentData.institutionId || null,
        assignedInstitutionName: institutionName,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        statusHistory: admin.firestore.FieldValue.arrayUnion({
          status: "assigned",
          timestamp: admin.firestore.Timestamp.now(),
          agentId: uid,
          agentName,
        }),
      });
    });

    console.log(`[TakeAlert] Alerta ${alertId} tomada exitosamente por ${uid}`);
    return { success: true };
  } catch (error) {
    console.error(`[TakeAlert] Error al tomar alerta ${alertId}:`, error);
    if (error instanceof HttpsError) throw error;
    const msg = error instanceof Error ? error.message : "Error desconocido";
    throw new HttpsError("internal", `Error al tomar la alerta: ${msg}`);
  }
});

// ============ FUNCIÓN: Actualizar Estado de Alerta ============

interface UpdateAlertStatusInput {
  alertId: string;
  newStatus: string;
  note?: string;
}

const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  assigned: ["in_progress"],
  in_progress: ["resolved"],
};

export const updateAlertStatus = onCall<UpdateAlertStatusInput>(
  { invoker: "public" },
  async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debe estar autenticado");
  }

  const uid = request.auth.uid;
  const { alertId, newStatus, note } = request.data;

  if (!alertId || !newStatus) {
    throw new HttpsError("invalid-argument", "El ID de la alerta y el nuevo estado son requeridos");
  }

  console.log(`[UpdateAlertStatus] Agente ${uid} actualizando alerta ${alertId} a estado ${newStatus}`);

  try {
    // Obtener datos de la alerta
    const alertRef = db.collection("alerts").doc(alertId);
    const alertDoc = await alertRef.get();

    if (!alertDoc.exists) {
      throw new HttpsError("not-found", "La alerta no existe");
    }

    const alertData = alertDoc.data() as AlertData;

    // Verificar que el agente es el asignado
    if (alertData.assignedTo !== uid) {
      throw new HttpsError(
        "permission-denied",
        "Solo el agente asignado puede actualizar el estado de esta alerta"
      );
    }

    // Validar transición de estado
    const allowedTransitions = VALID_STATUS_TRANSITIONS[alertData.status];
    if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
      throw new HttpsError(
        "failed-precondition",
        `No se puede cambiar de "${alertData.status}" a "${newStatus}". Transiciones permitidas: ${allowedTransitions ? allowedTransitions.join(", ") : "ninguna"}`
      );
    }

    // Obtener datos del agente para el historial
    const agentDoc = await db.collection("users").doc(uid).get();
    const agentData = agentDoc.data() as UserData;
    const agentName = `${agentData.firstName} ${agentData.lastName}`;

    // Construir historial entry
    const historyEntry: Record<string, unknown> = {
      status: newStatus,
      timestamp: admin.firestore.Timestamp.now(),
      agentId: uid,
      agentName,
    };

    if (note) {
      historyEntry.note = note;
    }

    // Construir datos de actualización
    const updateData: Record<string, unknown> = {
      status: newStatus,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      statusHistory: admin.firestore.FieldValue.arrayUnion(historyEntry),
    };

    if (newStatus === "resolved") {
      updateData.resolvedAt = admin.firestore.FieldValue.serverTimestamp();
    }

    await alertRef.update(updateData);

    console.log(`[UpdateAlertStatus] Alerta ${alertId} actualizada a ${newStatus} por agente ${uid}`);
    return { success: true };
  } catch (error) {
    console.error(`[UpdateAlertStatus] Error al actualizar alerta ${alertId}:`, error);
    if (error instanceof HttpsError) throw error;
    const msg = error instanceof Error ? error.message : "Error desconocido";
    throw new HttpsError("internal", `Error al actualizar el estado de la alerta: ${msg}`);
  }
});

// ============ FUNCIÓN: Derivar Alerta a otra Institución ============

interface DeriveAlertInput {
  alertId: string;
  institutionId: string;
  reason: string;
}

export const deriveAlert = onCall<DeriveAlertInput>(
  { invoker: "public" },
  async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debe estar autenticado");
  }

  const uid = request.auth.uid;
  const { alertId, institutionId, reason } = request.data;

  if (!alertId || !institutionId || !reason) {
    throw new HttpsError("invalid-argument", "alertId, institutionId y reason son requeridos");
  }

  console.log(`[DeriveAlert] Agente ${uid} derivando alerta ${alertId} a institución ${institutionId}`);

  try {
    // 1. Verificar que el usuario es agente activo
    const agentDoc = await db.collection("users").doc(uid).get();
    if (!agentDoc.exists) {
      throw new HttpsError("not-found", "Agente no encontrado");
    }
    const agentData = agentDoc.data() as UserData;

    if (agentData.role !== "agent" || !agentData.isActive) {
      throw new HttpsError("permission-denied", "Solo agentes activos pueden derivar alertas");
    }

    // 2. Verificar que la alerta existe y está asignada al agente
    const alertRef = db.collection("alerts").doc(alertId);
    const alertDoc = await alertRef.get();

    if (!alertDoc.exists) {
      throw new HttpsError("not-found", "La alerta no existe");
    }

    const alertData = alertDoc.data() as AlertData;

    if (alertData.assignedTo !== uid) {
      throw new HttpsError("permission-denied", "Solo el agente asignado puede derivar esta alerta");
    }

    if (alertData.status !== "assigned" && alertData.status !== "in_progress") {
      throw new HttpsError("failed-precondition", "Solo se pueden derivar alertas en estado asignada o en progreso");
    }

    // 3. Verificar que la institución destino es diferente
    if (institutionId === agentData.institutionId) {
      throw new HttpsError("invalid-argument", "No puedes derivar a tu propia institución");
    }

    // 4. Obtener datos de la institución destino
    const instDoc = await db.collection("institutions").doc(institutionId).get();
    if (!instDoc.exists) {
      throw new HttpsError("not-found", "Institución destino no encontrada");
    }
    const instData = instDoc.data() as { name: string; isActive: boolean };

    if (!instData.isActive) {
      throw new HttpsError("failed-precondition", "La institución destino no está activa");
    }

    const agentName = `${agentData.firstName} ${agentData.lastName}`;

    // 5. Actualizar la alerta
    const historyEntry = {
      status: "derived",
      timestamp: admin.firestore.Timestamp.now(),
      agentId: uid,
      agentName,
      note: reason,
      derivedTo: instData.name,
    };

    await alertRef.update({
      status: "pending",
      assignedTo: null,
      assignedAgentName: null,
      assignedInstitution: null,
      assignedInstitutionName: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      statusHistory: admin.firestore.FieldValue.arrayUnion(historyEntry),
    });

    // 6. Notificar agentes de la institución destino
    const targetAgents = await db
      .collection("users")
      .where("role", "==", "agent")
      .where("isActive", "==", true)
      .where("institutionId", "==", institutionId)
      .get();

    const tokens: string[] = [];
    const agentIds: string[] = [];
    targetAgents.forEach((doc) => {
      const data = doc.data() as UserData;
      if (data.expoPushToken) {
        tokens.push(data.expoPushToken);
        agentIds.push(doc.id);
      }
    });

    if (tokens.length > 0) {
      await sendPushToMany(
        tokens,
        "Alerta Derivada",
        `Se ha derivado una alerta a ${instData.name}. Motivo: ${reason.substring(0, 80)}`,
        { alertId, type: "derived" },
      );

      // Crear notificaciones en Firestore
      const batch = db.batch();
      agentIds.forEach((agentId) => {
        const notifRef = db.collection("notifications").doc();
        batch.set(notifRef, {
          userId: agentId,
          type: "alert_derived",
          title: "Alerta Derivada",
          body: `Se ha derivado una alerta a ${instData.name}`,
          alertId,
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });
      await batch.commit();
    }

    // 7. Notificar al ciudadano
    const citizenDoc = await db.collection("users").doc(alertData.createdBy).get();
    if (citizenDoc.exists) {
      const citizenData = citizenDoc.data() as UserData;
      if (citizenData.expoPushToken) {
        await sendPushToOne(
          citizenData.expoPushToken,
          "Alerta Derivada",
          `Tu alerta ha sido derivada a ${instData.name} para una mejor atención.`,
          { alertId, type: "derived" },
        );
      }

      await db.collection("notifications").add({
        userId: alertData.createdBy,
        type: "alert_derived",
        title: "Alerta Derivada",
        body: `Tu alerta ha sido derivada a ${instData.name} para una mejor atención.`,
        alertId,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    console.log(`[DeriveAlert] Alerta ${alertId} derivada a ${instData.name} por agente ${uid}`);
    return { success: true };
  } catch (error) {
    console.error(`[DeriveAlert] Error al derivar alerta ${alertId}:`, error);
    if (error instanceof HttpsError) throw error;
    const msg = error instanceof Error ? error.message : "Error desconocido";
    throw new HttpsError("internal", `Error al derivar la alerta: ${msg}`);
  }
});
