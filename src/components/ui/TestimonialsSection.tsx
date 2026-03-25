"use client";

import { useState, useEffect } from "react";
import TestimonialCarousel from "./TestimonialCarousel";
import ScrollReveal from "./ScrollReveal";

export default function TestimonialsSection() {
  const [testimonios, setTestimonios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonios")
      .then((res) => res.json())
      .then((data) => {
        setTestimonios(data);
        setLoading(false);
      });
  }, []);

  if (loading || !testimonios || testimonios.length === 0) return null;

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
