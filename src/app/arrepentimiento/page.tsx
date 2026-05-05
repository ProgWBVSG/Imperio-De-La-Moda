"use client";

import Link from "next/link";
import { useState } from "react";

export default function BotonArrepentimiento() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [pedido, setPedido] = useState("");
  const [motivo, setMotivo] = useState("");
  const [enviado, setEnviado] = useState(false);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493512336795";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mensaje = `Hola, quiero ejercer mi derecho de arrepentimiento.\n\nNombre: ${nombre}\nEmail: ${email}\nN° de pedido/referencia: ${pedido}\nMotivo: ${motivo}\n\nAguardo su respuesta. Gracias.`;

    const url = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
    setEnviado(true);
  };

  return (
    <div className="bg-bg min-h-screen">
      <section className="bg-primary text-white py-12 px-4 text-center">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Botón de Arrepentimiento</h1>
        <p className="text-gray-400 text-sm">Ley N° 24.240 – Defensa del Consumidor</p>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-border p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-primary mb-4">Tu derecho a arrepentirte</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            De acuerdo con el <strong>artículo 34 de la Ley N° 24.240 de Defensa del Consumidor</strong> de la República Argentina, tenés derecho a revocar la aceptación de una compra realizada a distancia (online, telefónica, etc.) dentro de los <strong>10 días corridos</strong> contados a partir de la fecha de recepción del producto o de la celebración del contrato.
          </p>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Este derecho aplica sin necesidad de justificar el motivo y sin costo alguno para vos, salvo los gastos de devolución del producto.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-amber-800 text-sm font-medium">
              <strong>Importante:</strong> El producto debe ser devuelto en las mismas condiciones en que fue recibido, sin uso, con sus etiquetas y empaques originales.
            </p>
          </div>

          <h3 className="text-lg font-bold text-primary mb-3 mt-6">Condiciones</h3>
          <ul className="text-gray-600 space-y-2 list-disc pl-6 mb-6">
            <li>El plazo de arrepentimiento es de <strong>10 días corridos</strong> desde la recepción del producto.</li>
            <li>El producto debe estar <strong>sin uso y en su estado original</strong>.</li>
            <li>Debés contar con el comprobante de compra (ticket, factura o captura de pedido).</li>
            <li>Una vez recibido el producto devuelto en condiciones, se procederá al reembolso dentro de los 10 días hábiles siguientes.</li>
          </ul>
        </div>

        {enviado ? (
          <div className="bg-white rounded-xl border border-accent/30 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Solicitud enviada</h3>
            <p className="text-gray-600 mb-4">Te redirigimos a WhatsApp para completar tu solicitud. Nuestro equipo te responderá a la brevedad.</p>
            <Link href="/" className="text-accent font-bold hover:underline">← Volver al inicio</Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-border p-6 md:p-8">
            <h2 className="text-xl font-bold text-primary mb-6">Formulario de arrepentimiento</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Nombre completo</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none"
                  placeholder="Tu nombre y apellido"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">N° de pedido o referencia</label>
                <input
                  type="text"
                  required
                  value={pedido}
                  onChange={(e) => setPedido(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none"
                  placeholder="Ej: Pedido del 01/05/2026"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Motivo (opcional)</label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none resize-none"
                  placeholder="Contanos brevemente por qué querés devolver el producto"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg"
              >
                Enviar solicitud de arrepentimiento
              </button>
            </form>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-border">
          <Link href="/" className="text-accent font-bold hover:underline">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
