"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TestimonialsSection from "@/components/ui/TestimonialsSection";

export default function Home() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493512336795";
  const heroWhatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=Hola,%20me%20interesa%20comprar%20ropa%20por%20mayor`;

  return (
    <div className="flex flex-col gap-0">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop"
            alt="Interior tienda de ropa de moda"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        </div>

        {/* Elementos decorativos del hero — claramente visibles */}
        {/* Rombo grande esquina superior izquierda */}
        <div className="absolute top-[-40px] left-[-40px] w-48 h-48 border-2 border-accent/40 rotate-45 hidden md:block" />
        <div className="absolute top-[10px] left-[10px] w-36 h-36 border border-accent/20 rotate-45 hidden md:block" />
        {/* Rombo grande esquina inferior derecha */}
        <div className="absolute bottom-[-40px] right-[-40px] w-48 h-48 border-2 border-accent/40 rotate-45 hidden md:block" />
        <div className="absolute bottom-[10px] right-[10px] w-36 h-36 border border-accent/20 rotate-45 hidden md:block" />
        {/* Líneas horizontales de acento en los costados */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-px bg-accent/50" style={{ width: `${24 - i * 4}px` }} />
          ))}
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 items-end">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-px bg-accent/50" style={{ width: `${24 - i * 4}px` }} />
          ))}
        </div>
        {/* Círculos flotantes */}
        <div className="absolute top-20 left-16 w-28 h-28 border border-accent/30 rounded-full animate-float hidden md:block" />
        <div className="absolute bottom-24 right-20 w-16 h-16 border border-accent/25 rounded-full animate-float delay-300 hidden md:block" />

        <div className="relative z-10 px-6 max-w-4xl flex flex-col items-center">
          <span className="text-accent text-sm font-bold uppercase tracking-[0.3em] mb-6 animate-fade-in">San Martín 390 · Córdoba</span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up leading-tight">
            Ropa de calidad,{" "}
            <span className="text-accent italic">precio que te conviene</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 font-medium animate-fade-in-up delay-200 max-w-2xl">
            Desde <span className="text-white font-bold">$4.000</span> hasta <span className="text-white font-bold">$20.000</span> ARS
            <span className="text-accent mx-3">·</span>
            Mayorista y minorista
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up delay-300">
            <Link
              href="/catalogo"
              className="bg-accent text-primary px-8 py-4 rounded-radius-base font-bold text-lg hover:scale-105 transition-all text-center shadow-lg"
            >
              Ver catálogo
            </Link>
            <a
              href={heroWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-whatsapp text-white px-8 py-4 rounded-radius-base font-bold text-lg hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Escribinos</span>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.096-1.332-.116-.399-.129-1.071-.352-2.05-1.127-1.106-.878-1.722-2.087-1.917-2.359-.14-.195-.477-.6-.477-1.163 0-.583.273-.892.4-.103.11-.122.258-.142.35-.142.11 0 .204.004.298.006.115.006.27-.044.423.324.156.377.534 1.304.58 1.402.046.096.082.203.013.344-.069.143-.106.23-.21.353-.105.123-.224.272-.319.349-.107.086-.22.18-.101.385.118.204.526.87 1.134 1.41.785.698 1.439.914 1.644.914.205 0 .324.088.441-.044.116-.134.502-.584.636-.786.134-.202.268-.168.455-.098.188.07.118-.616 1.391-.685.187-.07.31-.105.356-.142.045-.038.045-.195-.098-.6z" /></svg>
            </a>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* 2. CATEGORÍAS */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full relative">
        {/* Rombo ornamental centrado entre secciones */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent/50" />
          <div className="w-3 h-3 border border-accent/60 rotate-45" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent/50" />
        </div>

       <ScrollReveal>
        <div className="section-heading">
          <h2>Descubrí nuestras colecciones</h2>
          <span className="decorative-line decorative-line-center"></span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { name: "Mujer", img: "https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=1000&auto=format&fit=crop" },
            { name: "Hombre", img: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1000&auto=format&fit=crop" },
            { name: "Niños", img: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=1000&auto=format&fit=crop" },
            { name: "Accesorios", img: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=1000&auto=format&fit=crop" },
          ].map((cat) => (
            <Link href={`/catalogo?categoria=${cat.name.toLowerCase()}`} key={cat.name} className="group relative h-72 md:h-80 overflow-hidden rounded-2xl shadow-md">
              <Image src={cat.img} alt={`Categoría ${cat.name}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-2xl font-bold drop-shadow-lg">{cat.name}</h3>
                <div className="flex items-center gap-2 mt-2 text-accent text-sm font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span>Ver productos</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
       </ScrollReveal>

        {/* Separador ornamental inferior */}
        <div className="flex items-center gap-3 mt-16 justify-center opacity-50">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-accent" />
          <div className="w-2 h-2 border border-accent rotate-45" />
          <div className="w-1 h-1 bg-accent rounded-full" />
          <div className="w-2 h-2 border border-accent rotate-45" />
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-accent" />
        </div>
      </section>

      {/* 3. ESTADÍSTICAS */}
      <section className="bg-primary py-10 overflow-hidden relative">
        {/* Detalles de fondo: puntos decorativos */}
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        {/* Líneas diagonales de textura tipo tela */}
        <div className="absolute top-0 right-0 w-40 h-full opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />
        <div className="absolute top-0 left-0 w-40 h-full opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />

        <ScrollReveal direction="scale">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-0 text-center relative z-10">
            {[
              { num: "+5.000", label: "Clientes satisfechos" },
              { num: "40%", label: "Ahorro por mayor" },
              { num: "+12", label: "A\u00f1os de experiencia" },
              { num: "6", label: "Prendas m\u00edn. mayorista" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center px-8 md:px-12 first:border-l-0 md:border-l border-white/10">
                <span className="text-accent text-3xl md:text-5xl font-bold tracking-tight">{stat.num}</span>
                <span className="text-gray-500 text-xs mt-2 uppercase tracking-[0.2em] font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 4. PROPUESTA DE VALOR */}
      <section className="py-24 bg-surface relative overflow-hidden">
        {/* Formas flotantes decorativas de fondo */}
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-accent/5 blur-2xl" />
        <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-accent/4 blur-3xl" />
        {/* Hilo de costura decorativo vertical en los costados */}
        <div className="absolute left-6 top-1/4 h-1/2 w-px hidden xl:block" style={{ background: 'repeating-linear-gradient(180deg, #C9A84C 0px, #C9A84C 5px, transparent 5px, transparent 12px)', opacity: 0.2 }} />
        <div className="absolute right-6 top-1/4 h-1/2 w-px hidden xl:block" style={{ background: 'repeating-linear-gradient(180deg, #C9A84C 0px, #C9A84C 5px, transparent 5px, transparent 12px)', opacity: 0.2 }} />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="section-heading">
              <span className="fashion-tag mb-4 mx-auto">Por qué elegirnos</span>
              <h2 className="mt-4">Ropa de calidad,<br /><em className="text-accent">precio honesto</em></h2>
              <span className="decorative-line decorative-line-center"></span>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "💰", title: "Precios desde $4.000", desc: "Ropa asequible con márgenes reales si comprás por mayor. Sin intermediarios." },
              { icon: "✅", title: "Calidad garantizada", desc: "Telas duraderas, control de costura y garantía de fábrica en cada prenda." },
              { icon: "💬", title: "Atención directa", desc: "Sin chat bots genéricos. Te respondemos directo por WhatsApp y te asesoramos." },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 150} direction="up">
              <div className="bg-white p-8 rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group relative overflow-hidden">
                {/* Esquina decorativa */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-bl-3xl" />
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 group-hover:bg-accent/20 transition-all">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-text-muted leading-relaxed text-sm">{item.desc}</p>
                {/* Línea inferior decorativa */}
                <div className="mt-6 mx-auto w-8 h-0.5 bg-accent/30 rounded group-hover:w-16 transition-all duration-500" />
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIOS DINÁMICOS */}
      <TestimonialsSection />

      {/* DIVISOR DECORATIVO — rompe el espacio vacío */}
      <div className="relative py-16 overflow-hidden flex items-center justify-center">
        {/* Círculo grande dorado de fondo — claramente visible */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-accent/25" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-accent/15" />
        {/* Líneas largas a los costados */}
        <div className="absolute left-0 top-1/2 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.3) 30%, rgba(201,168,76,0.3) 70%, transparent 100%)' }} />
        {/* Texto ornamental central */}
        <div className="relative z-10 flex items-center gap-6">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-accent/50" />
          <span className="text-accent/60 text-xs font-bold uppercase tracking-[0.35em]">Imperio de la Moda</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-accent/50" />
        </div>
      </div>

      {/* 6. EL LOCAL */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <ScrollReveal direction="left">
          <div>
            <span className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-4 block">Visitá nuestro local</span>
            <h2 className="text-4xl font-bold text-primary mb-6 leading-tight">Te esperamos<br />en el local</h2>
            <span className="decorative-line mb-8"></span>
            <p className="text-text-muted mb-8 leading-relaxed">
              Vení a probarte, elegí en persona y llevate lo que más te guste. Te asesoramos tanto si venís a renovar tu placard como si querés emprender tu propio negocio revendiendo.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-xl text-accent mt-0.5 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-primary">Dirección</h4>
                  <p className="text-text-muted text-sm">San Martín 390, X5000 Córdoba</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-xl text-accent mt-0.5 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-primary">Horarios</h4>
                  <p className="text-text-muted text-sm">L a V: 9:00 – 18:00 · Sáb: 9:00 – 13:00</p>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=San+Martin+390,+Cordoba,+Argentina"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 border-2 border-primary text-primary px-6 py-3 rounded-radius-base font-bold hover:bg-primary hover:text-white transition-all text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
              <span>Ver en Google Maps</span>
            </a>

            {/* Botón Reseña Dorada */}
            <div className="gold-review-btn-wrapper mt-3">
              <a
                href="https://search.google.com/local/writereview?placeid=ChIJT-pLOQCZMpQR5LGAoKROv10"
                target="_blank"
                rel="noopener noreferrer"
                className="gold-review-btn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ¡Ayudanos con tu reseña!
              </a>
            </div>
          </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
          <div className="h-96 lg:h-[28rem] bg-gray-200 rounded-2xl overflow-hidden relative shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.088016260303!2d-64.18209089999999!3d-31.411700999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94329900394bea4f%3A0x5dbf4ea4a080b1e4!2sImperio%20de%20la%20Moda!5e0!3m2!1ses-419!2sar!4v1773808575777!5m2!1ses-419!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
              title="Mapa de Imperio de la Moda"
            ></iframe>
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 7. CTA FINAL */}
      <section className="relative bg-primary py-24 px-4 text-center overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent/5 rounded-full translate-x-1/4 translate-y-1/4"></div>

        <ScrollReveal direction="scale">
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-accent text-sm font-bold uppercase tracking-[0.3em] mb-4 block">Programa Mayorista</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Empezá tu propio<br />negocio hoy
          </h2>
          <span className="decorative-line decorative-line-center mb-8"></span>
          <p className="text-lg text-gray-400 mb-10 font-medium leading-relaxed max-w-xl mx-auto">
            Comprá al mejor precio mayorista directo en Córdoba y revendé en tu ciudad. Nosotros te asesoramos con la primera orden.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/mayoristas"
              className="bg-accent text-primary px-8 py-4 rounded-radius-base font-bold text-lg hover:scale-105 transition-all shadow-lg"
            >
              Info para revendedores
            </Link>
            <a
              href={heroWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-radius-base font-bold text-lg hover:bg-white hover:text-primary transition-all"
            >
              Hablar por WhatsApp
            </a>
          </div>
        </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
