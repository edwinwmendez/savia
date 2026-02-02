# Ideas Futuras - SAVIA

Registro de ideas y mejoras para implementar en futuros sprints.

---

## 1. Notificaciones en tiempo real para Admin Web

**Problema**: El panel admin no recibe notificaciones push. Solo ve datos al consultar Firestore manualmente (recargando la pagina o navegando).

**Solucion propuesta**: Implementar notificaciones en tiempo real usando una de estas opciones:
- **Opcion A**: Real-time listeners de Firestore (`onSnapshot`) para que el dashboard se actualice automaticamente cuando llegan nuevas alertas o cambian de estado.
- **Opcion B**: Web Push Notifications con Service Workers para que el admin reciba notificaciones del navegador incluso con la pestana en segundo plano.
- **Opcion C**: Ambas combinadas (listeners para datos en vivo + Web Push para avisos cuando no esta mirando).

**Contexto**: Actualmente las push notifications solo funcionan en dispositivos moviles via Expo/FCM. El admin web no tiene ningun mecanismo de aviso activo.
