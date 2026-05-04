"use client";

import { useState, useEffect } from "react";
import TestimonialCarousel from "./TestimonialCarousel";
import ScrollReveal from "./ScrollReveal";

// Testimonios de respaldo por si la API no devuelve nada
const FALLBACK: any[] = [
  { id: "f1", autor: "Laura G.",     texto: "Fui al local a buscar calzas y remeras. Excelente atencion, me probaron lo que pedi y los precios son inmejorables.", origen: "Google Maps", visible: true, creado_en: "" },
  { id: "f2", autor: "Martin P.",    texto: "La campera puffer me salio la mitad que en el centro comercial. Totalmente recomendable.", origen: "TikTok",      visible: true, creado_en: "" },
  { id: "f3", autor: "Valentina R.", texto: "Pedi por WhatsApp y me asesoraron super bien. Llego todo en perfectas condiciones. 100% recomendado!", origen: "WhatsApp",   visible: true, creado_en: "" },
];

export default function TestimonialsSection() {
  const [testimonios, setTestimonios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonios")
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data) => {
        setTestimonios(Array.isArray(data) && data.length > 0 ? data : FALLBACK);
        setLoading(false);
      })
      .catch(() => {
        setTestimonios(FALLBACK);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <section className="py-24 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <ScrollReveal>
          <div className="section-heading">
            <h2>Lo que dicen nuestros clientes</h2>
            <span className="decorative-line decorative-line-center"></span>
          </div>
        </ScrollReveal>
      </div>

      {/* El ticker va de borde a borde, sin padding lateral */}
      <TestimonialCarousel testimonios={testimonios} />
    </section>
  );
}
