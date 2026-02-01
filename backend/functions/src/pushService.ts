/**
 * SAVIA - Push Notification Service
 * Servicio de notificaciones push usando Expo Server SDK
 */

import { Expo, ExpoPushMessage } from "expo-server-sdk";

const expo = new Expo();

/**
 * Envia una notificacion push a un unico destinatario.
 * Valida que el token sea un token Expo valido antes de enviar.
 */
export async function sendPushToOne(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> {
  if (!Expo.isExpoPushToken(token)) {
    console.error(`[Push] Token invalido: ${token}`);
    return;
  }

  try {
    const tickets = await expo.sendPushNotificationsAsync([{
      to: token,
      sound: "default",
      title,
      body,
      data: data || {},
      channelId: "alerts",
    }]);

    tickets.forEach((ticket) => {
      if (ticket.status === "error") {
        console.error(`[Push] Error: ${ticket.message}`, ticket.details);
      }
    });
  } catch (error) {
    console.error("[Push] Error enviando notificacion:", error);
  }
}

/**
 * Envia una notificacion push a multiples destinatarios.
 * Filtra tokens invalidos y usa chunking de Expo para envios masivos.
 */
export async function sendPushToMany(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> {
  const validTokens = tokens.filter((t) => Expo.isExpoPushToken(t));

  if (validTokens.length === 0) {
    console.log("[Push] No hay tokens Expo validos");
    return;
  }

  const messages: ExpoPushMessage[] = validTokens.map((token) => ({
    to: token,
    sound: "default" as const,
    title,
    body,
    data: data || {},
    channelId: "alerts",
  }));

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      const success = tickets.filter((t) => t.status === "ok").length;
      const failed = tickets.filter((t) => t.status === "error").length;
      console.log(`[Push] Enviadas: ${success} exitosas, ${failed} fallidas`);

      tickets.forEach((ticket) => {
        if (ticket.status === "error") {
          console.error(`[Push] Error: ${ticket.message}`, ticket.details);
        }
      });
    } catch (error) {
      console.error("[Push] Error enviando chunk:", error);
    }
  }
}
