import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad - SAVIA',
  description: 'Política de privacidad de la aplicación SAVIA - Sistema de Alertas Vecinales Integrado de Atalaya',
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Política de Privacidad
        </h1>

        <p className="text-sm text-gray-500 mb-8">
          Última actualización: 3 de febrero de 2026
        </p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              1. Introducción
            </h2>
            <p className="text-gray-700 mb-4">
              SAVIA (Sistema de Alertas Vecinales Integrado de Atalaya) es una aplicación móvil
              desarrollada para mejorar la seguridad ciudadana en el distrito de Atalaya, Perú.
              Esta política de privacidad describe cómo recopilamos, usamos y protegemos tu
              información personal.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              2. Información que recopilamos
            </h2>
            <p className="text-gray-700 mb-4">
              Recopilamos los siguientes tipos de información:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Información de registro:</strong> nombre, correo electrónico, número de
                teléfono y DNI para crear tu cuenta.
              </li>
              <li>
                <strong>Ubicación:</strong> tu ubicación GPS cuando reportas una emergencia o
                consultas alertas cercanas. Solo accedemos a tu ubicación cuando usas activamente
                la aplicación.
              </li>
              <li>
                <strong>Contenido de alertas:</strong> descripciones, fotos y videos que adjuntas
                a los reportes de emergencia.
              </li>
              <li>
                <strong>Información del dispositivo:</strong> modelo del dispositivo, versión del
                sistema operativo y tokens de notificación para enviarte alertas.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              3. Cómo usamos tu información
            </h2>
            <p className="text-gray-700 mb-4">
              Usamos tu información para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Procesar y gestionar tus reportes de emergencia.</li>
              <li>Notificarte sobre alertas en tu zona.</li>
              <li>Coordinar la respuesta de autoridades (PNP, Serenazgo, Bomberos).</li>
              <li>Mejorar nuestros servicios y la seguridad de la aplicación.</li>
              <li>Comunicarnos contigo sobre el estado de tus reportes.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              4. Compartición de información
            </h2>
            <p className="text-gray-700 mb-4">
              Tu información puede ser compartida con:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Autoridades de seguridad:</strong> Policía Nacional del Perú, Serenazgo,
                Bomberos y otras instituciones autorizadas para atender emergencias.
              </li>
              <li>
                <strong>Proveedores de servicios:</strong> Firebase (Google) para autenticación,
                almacenamiento y notificaciones; Sentry para monitoreo de errores.
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              No vendemos ni compartimos tu información personal con terceros para fines
              publicitarios.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              5. Seguridad de los datos
            </h2>
            <p className="text-gray-700 mb-4">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu
              información, incluyendo:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Cifrado de datos en tránsito (HTTPS/TLS).</li>
              <li>Autenticación segura mediante Firebase Authentication.</li>
              <li>Reglas de seguridad en base de datos que limitan el acceso según el rol del usuario.</li>
              <li>Almacenamiento seguro en servidores de Google Cloud Platform.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              6. Retención de datos
            </h2>
            <p className="text-gray-700 mb-4">
              Conservamos tu información mientras mantengas una cuenta activa en SAVIA. Los
              reportes de emergencia se conservan por el tiempo necesario para fines de
              seguimiento y estadísticas de seguridad ciudadana. Puedes solicitar la
              eliminación de tu cuenta y datos personales contactándonos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              7. Tus derechos
            </h2>
            <p className="text-gray-700 mb-4">
              De acuerdo con la Ley de Protección de Datos Personales del Perú (Ley N° 29733),
              tienes derecho a:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Acceder a tu información personal.</li>
              <li>Rectificar datos inexactos.</li>
              <li>Cancelar o eliminar tus datos.</li>
              <li>Oponerte al tratamiento de tus datos.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Para ejercer estos derechos, contáctanos a través del correo electrónico indicado
              abajo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              8. Permisos de la aplicación
            </h2>
            <p className="text-gray-700 mb-4">
              SAVIA solicita los siguientes permisos:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Ubicación:</strong> para geolocalizar tus reportes de emergencia y
                mostrarte alertas cercanas.
              </li>
              <li>
                <strong>Cámara:</strong> para tomar fotos como evidencia en tus reportes.
              </li>
              <li>
                <strong>Galería/Fotos:</strong> para adjuntar imágenes existentes a tus reportes.
              </li>
              <li>
                <strong>Notificaciones:</strong> para alertarte sobre emergencias en tu zona.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              9. Cambios a esta política
            </h2>
            <p className="text-gray-700 mb-4">
              Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos
              sobre cambios significativos a través de la aplicación o por correo electrónico.
              Te recomendamos revisar esta página periódicamente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              10. Contacto
            </h2>
            <p className="text-gray-700 mb-4">
              Si tienes preguntas sobre esta política de privacidad o sobre el tratamiento de
              tus datos personales, puedes contactarnos en:
            </p>
            <p className="text-gray-700">
              <strong>Correo electrónico:</strong> edwinwmendez@gmail.com
            </p>
          </section>
        </div>

        <hr className="my-8 border-gray-200" />

        <p className="text-center text-sm text-gray-500">
          © 2026 SAVIA - Sistema de Alertas Vecinales Integrado de Atalaya
        </p>
      </div>
    </main>
  );
}
