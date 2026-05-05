import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones - Imperio de la Moda",
  description: "Términos y condiciones de uso del sitio web de Imperio de la Moda.",
};

export default function TerminosCondiciones() {
  return (
    <div className="bg-bg min-h-screen">
      <section className="bg-primary text-white py-12 px-4 text-center">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Términos y Condiciones</h1>
        <p className="text-gray-400 text-sm">Última actualización: Mayo 2026</p>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
        <h2 className="text-xl font-bold text-primary mb-4">1. Generalidades</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Los presentes Términos y Condiciones regulan el uso del sitio web de <strong>Imperio de la Moda</strong>, con domicilio comercial en San Martín 390, Córdoba Capital, Argentina. Al acceder y utilizar este sitio web, aceptás estar sujeto a estos términos.
        </p>

        <h2 className="text-xl font-bold text-primary mb-4">2. Productos y precios</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Los productos exhibidos en el sitio web están sujetos a disponibilidad de stock. Los precios publicados pueden ser modificados sin previo aviso. Las imágenes de los productos son de carácter ilustrativo y pueden presentar leves variaciones respecto al producto real en cuanto a color o tonalidad.
        </p>

        <h2 className="text-xl font-bold text-primary mb-4">3. Compras mayoristas</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Para acceder a precios mayoristas, se requiere una compra mínima de <strong>6 prendas</strong>, pudiendo combinar modelos, talles y colores. Los precios mayoristas están exclusivamente destinados a revendedores y comerciantes.
        </p>

        <h2 className="text-xl font-bold text-primary mb-4">4. Medios de pago</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Aceptamos los siguientes medios de pago:
        </p>
        <ul className="text-gray-600 mb-6 space-y-2 list-disc pl-6">
          <li><strong>Efectivo:</strong> con un 10% de descuento adicional.</li>
          <li><strong>Transferencia bancaria.</strong></li>
        </ul>

        <h2 className="text-xl font-bold text-primary mb-4">5. Envíos y entregas</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Actualmente las ventas se realizan con <strong>retiro en nuestro local</strong> ubicado en San Martín 390, Córdoba Capital. No realizamos envíos a domicilio por el momento. Te invitamos a visitar nuestro local para verificar la calidad de los productos en persona.
        </p>

        <h2 className="text-xl font-bold text-primary mb-4">6. Cambios y devoluciones</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Aceptamos cambios dentro de los <strong>30 días corridos</strong> posteriores a la compra, presentando el ticket o comprobante de compra. El producto debe encontrarse en perfecto estado, sin uso, con sus etiquetas originales. No se realizan devoluciones de dinero, salvo lo establecido por la Ley N° 24.240 de Defensa del Consumidor.
        </p>

        <h2 className="text-xl font-bold text-primary mb-4">7. Propiedad intelectual</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Todo el contenido del sitio web (textos, imágenes, logos, diseños) es propiedad de Imperio de la Moda y está protegido por las leyes de propiedad intelectual vigentes. Queda prohibida su reproducción total o parcial sin autorización previa por escrito.
        </p>

        <h2 className="text-xl font-bold text-primary mb-4">8. Limitación de responsabilidad</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Imperio de la Moda no se responsabiliza por interrupciones del servicio web, errores técnicos o inexactitudes en la información publicada. Nos reservamos el derecho de modificar estos términos en cualquier momento.
        </p>

        <h2 className="text-xl font-bold text-primary mb-4">9. Legislación aplicable</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Los presentes términos se rigen por las leyes de la República Argentina. Cualquier controversia será sometida a la jurisdicción de los tribunales ordinarios de la Ciudad de Córdoba.
        </p>

        <h2 className="text-xl font-bold text-primary mb-4">10. Contacto</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Para cualquier consulta relacionada con estos términos, podés contactarnos vía WhatsApp o visitarnos en nuestro local.
        </p>

        <div className="mt-10 pt-6 border-t border-border">
          <Link href="/" className="text-accent font-bold hover:underline">← Volver al inicio</Link>
        </div>
      </article>
    </div>
  );
}
