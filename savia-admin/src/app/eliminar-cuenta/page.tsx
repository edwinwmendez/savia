import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eliminar Cuenta - SAVIA',
  description: 'Solicita la eliminación de tu cuenta y datos personales de SAVIA',
};

export default function EliminarCuentaPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Eliminar Cuenta
        </h1>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Solicitar eliminacion de cuenta
            </h2>
            <p className="text-gray-700 mb-4">
              Si deseas eliminar tu cuenta de SAVIA y todos los datos personales asociados,
              puedes solicitarlo siguiendo los pasos a continuacion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pasos para solicitar la eliminacion
            </h2>
            <ol className="list-decimal pl-6 text-gray-700 space-y-3">
              <li>
                Envia un correo electronico a{' '}
                <a
                  href="mailto:edwinwmendez@gmail.com?subject=Solicitud%20de%20eliminacion%20de%20cuenta%20SAVIA"
                  className="text-blue-600 hover:underline font-medium"
                >
                  edwinwmendez@gmail.com
                </a>
              </li>
              <li>
                En el asunto del correo escribe:{' '}
                <strong>&quot;Solicitud de eliminacion de cuenta SAVIA&quot;</strong>
              </li>
              <li>
                En el cuerpo del mensaje incluye:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Tu nombre completo</li>
                  <li>El correo electronico registrado en SAVIA</li>
                  <li>Tu numero de DNI (para verificar tu identidad)</li>
                </ul>
              </li>
              <li>
                Recibiras una confirmacion en un plazo maximo de 7 dias habiles.
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Datos que se eliminaran
            </h2>
            <p className="text-gray-700 mb-4">
              Al eliminar tu cuenta, se eliminaran permanentemente los siguientes datos:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Informacion de perfil (nombre, email, telefono, DNI)</li>
              <li>Historial de ubicaciones</li>
              <li>Tokens de notificaciones push</li>
              <li>Preferencias de la aplicacion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Datos que se conservaran
            </h2>
            <p className="text-gray-700 mb-4">
              Por razones legales y de seguridad publica, algunos datos se conservaran
              de forma anonimizada:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Alertas de emergencia:</strong> El contenido de las alertas que
                hayas reportado se conservara de forma anonima (sin vinculacion a tu
                identidad) para fines estadisticos y de seguridad ciudadana.
              </li>
              <li>
                <strong>Periodo de retencion:</strong> Los datos anonimizados se
                conservan indefinidamente para analisis de patrones de seguridad en
                el distrito.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tiempo de procesamiento
            </h2>
            <p className="text-gray-700 mb-4">
              Tu solicitud sera procesada en un plazo maximo de <strong>30 dias</strong>{' '}
              desde la recepcion del correo. Recibiras una confirmacion por email una
              vez que tu cuenta haya sido eliminada.
            </p>
          </section>

          <section className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Contacto directo
            </h2>
            <p className="text-blue-800">
              Si tienes preguntas sobre el proceso de eliminacion, escribe a:{' '}
              <a
                href="mailto:edwinwmendez@gmail.com"
                className="font-medium hover:underline"
              >
                edwinwmendez@gmail.com
              </a>
            </p>
          </section>
        </div>

        <hr className="my-8 border-gray-200" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2026 SAVIA - Sistema de Alertas Vecinales Integrado de Atalaya
          </p>
          <a
            href="/privacidad"
            className="text-sm text-blue-600 hover:underline"
          >
            Ver Politica de Privacidad
          </a>
        </div>
      </div>
    </main>
  );
}
