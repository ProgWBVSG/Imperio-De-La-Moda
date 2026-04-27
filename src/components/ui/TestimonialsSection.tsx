"use client";

import { useState, useEffect } from "react";
import TestimonialCarousel from "./TestimonialCarousel";
import ScrollReveal from "./ScrollReveal";

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
        // Aseguramos que data sea un array válido, sino seteamos un fallback
        if (Array.isArray(data)) {
          setTestimonios(data);
        } else {
          console.error("Testimonios API returned non-array payload", data);
          setTestimonios([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching testimonios:", err);
        setTestimonios([]);
        setLoading(false);
      });
  }, []);

  if (loading || !Array.isArray(testimonios) || testimonios.length === 0) return null;

  return (
    <section className="py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <div className="section-heading">
            <h2>Lo que dicen nuestros clientes</h2>
            <span className="decorative-line decorative-line-center"></span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200} direction="up">
          {/* El contenedor interior protege el layout del desborde del carousel */}
          <div className="px-2">
            <TestimonialCarousel testimonios={testimonios} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
