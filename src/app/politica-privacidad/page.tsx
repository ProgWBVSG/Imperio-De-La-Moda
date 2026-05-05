import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad - Imperio de la Moda",
  description: "Conocé cómo manejamos y protegemos tu información personal.",
};

export default function PoliticaPrivacidad() {
  return (
    <div className="bg-bg min-h-screen">
      <section className="bg-primary text-white py-12 px-4 text-center">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Política de Privacidad</h1>
        <p className="text-gray-400 text-sm">Última actualización: Mayo 2026</p>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
        <h2 className="text-xl font-bold text-primary mb-4">1. Información que recopilamos</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          En <strong>Imperio de la Moda</strong> recopilamos únicamente la información que nos proporcionás de forma voluntaria a través de nuestros formularios de contacto y suscripción: tu <strong>nombre</strong> y <strong>dirección de correo electrónico</strong>. No recopilamos datos sensibles, información financiera ni datos de ubicación.
        </p>

        <h2 className="text-xl font-bold text-primary mb-4">2. Uso de la información</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          La información proporcionada se utiliza exclusivamente para:
        </p>
        <ul className="text-gray-600 mb-6 space-y-2 list-disc pl-6">
          <li>Enviarte promociones exclusivas mayoristas y minoristas.</li>
          <li>Informarte sobre novedades, descuentos y lanzamientos de productos.</li>
          <li>Responder a tus consultas realizadas vía WhatsApp o formularios web.</li>
        </ul>

        <h2 className="text-xl font-bold text-primary mb-4">3. Protección de datos</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra el acceso no autorizado, pérdida, alteración o divulgación. Tus datos se almacenan en servidores seguros con encriptación.
        </p>

        <h2 className="text-xl font-bold text-primary mb-4">4. Compartición de datos</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          <strong>No vendemos, alquilamos ni compartimos</strong> tu información personal con terceros con fines comerciales. Solo podríamos compartir datos en caso de requerimiento legal o judicial.
        </p>

        <h2 className="text-xl font-bold text-primary mb-4">5. Cookies</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Nuestro sitio web utiliza cookies técnicas y de funcionalidad para mejorar tu experiencia de navegación. Estas cookies no recopilan información personal identificable.
        </p>

        <h2 className="text-xl font-bold text-primary mb-4">6. Derechos del usuario</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          En conformidad con la Ley N° 25.326 de Protección de Datos Personales de la República Argentina, tenés derecho a:
        </p>
        <ul className="text-gray-600 mb-6 space-y-2 list-disc pl-6">
          <li>Acceder a tus datos personales.</li>
          <li>Solicitar la rectificación o actualización de tus datos.</li>
          <li>Solicitar la supresión de tus datos de nuestra base.</li>
          <li>Oponerte al tratamiento de tus datos.</li>
        </ul>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Para ejercer cualquiera de estos derechos, podés comunicarte con nosotros vía WhatsApp o a través de nuestros canales de contacto.
        </p>

        <h2 className="text-xl font-bold text-primary mb-4">7. Contacto</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Para consultas sobre esta política, contactanos a través de nuestro WhatsApp o visitanos en <strong>San Martín 390, Córdoba Capital, Argentina</strong>.
        </p>

        <div className="mt-10 pt-6 border-t border-border">
          <Link href="/" className="text-accent font-bold hover:underline">← Volver al inicio</Link>
        </div>
      </article>
    </div>
  );
}
