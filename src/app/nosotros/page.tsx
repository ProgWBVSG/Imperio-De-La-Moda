import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Nuestra Historia | Local de Ropa en San Martín 382, Córdoba',
  description: 'Conocé la historia de Imperio de la Moda. +12 años vistiendo a Córdoba con ropa de calidad a precio justo. Visitanos en San Martín 382, centro.',
  alternates: { canonical: 'https://imperiolamoda.com.ar/nosotros' },
  openGraph: {
    title: 'Sobre Nosotros | Imperio de la Moda — Córdoba',
    description: 'Ropa de calidad, precio justo y trato cercano desde hace más de 12 años.',
  },
};

export default function Nosotros() {
  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* 1. HISTORIA */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">Nuestra Historia</h1>
              <div className="w-20 h-1 bg-accent"></div>
            </div>
            
            <div className="prose prose-lg text-gray-600 prose-p:leading-relaxed">
              <p>
                <strong>Imperio de la Moda</strong> nació con una premisa muy clara: demostrar que vestirse bien y comprar ropa de calidad no debería ser un privilegio inalcanzable.
              </p>
              <p>
                [HISTORIA PENDIENTE A CONFIRMAR: Acá va un texto real redactado junto al dueño, explicando cómo arrancó, por qué decidió poner el local en San Martín 390, y el sacrificio o anécdota fundacional del local.]
              </p>
              <p>
                Sabemos lo difícil que es emprender en Argentina. Por eso no solo vendemos ropa, sino que damos herramientas y asesoramiento para que quienes compran por mayor, puedan armar su propio negocio rentable y salir adelante en su ciudad.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-border">
              <div className="text-center">
                <span className="block font-display font-bold text-3xl text-primary">+100</span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Revendedores</span>
              </div>
              <div className="text-center border-x border-border">
                <span className="block font-display font-bold text-3xl text-primary">$$</span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Precio Justo</span>
              </div>
              <div className="text-center">
                <span className="block font-display font-bold text-3xl text-primary">100%</span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Calidad</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-accent translate-x-4 translate-y-4 rounded-2xl z-0"></div>
            <div className="relative z-10 h-[500px] w-full rounded-2xl overflow-hidden shadow-xl border border-white">
              <Image 
                src="/foto-local.jpeg"
                alt="Frente local Imperio de la Moda - San Martín 390, Córdoba"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 MISIÓN Y VISIÓN */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Texto a la izquierda */}
          <div className="space-y-6">
            <div>
              <span className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-3 block">Quiénes somos</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">Nuestra Misión</h2>
              <div className="w-20 h-1 bg-accent"></div>
            </div>

            <div className="prose prose-lg text-gray-600 prose-p:leading-relaxed">
              <p>
                Democratizar la moda de calidad en Argentina. Creemos que cada persona merece vestirse con prendas que duren, que se vean bien y que no vacíen el bolsillo.
              </p>
              <p>
                Trabajamos directamente con fabricantes nacionales, eliminando intermediarios para ofrecerte el mejor precio sin sacrificar calidad. Cada prenda que entra a nuestro local fue revisada, probada y aprobada por nosotros mismos.
              </p>
            </div>

            {/* Valores en cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </div>
                <h4 className="font-bold text-primary mb-1">Pasión</h4>
                <p className="text-sm text-gray-500">Amamos lo que hacemos y se nota en cada detalle del local y la atención.</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h4 className="font-bold text-primary mb-1">Honestidad</h4>
                <p className="text-sm text-gray-500">Precios transparentes, sin letra chica. Lo que ves es lo que pagás.</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <h4 className="font-bold text-primary mb-1">Comunidad</h4>
                <p className="text-sm text-gray-500">Impulsamos revendedores y emprendedores en todo el país.</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h4 className="font-bold text-primary mb-1">Evolución</h4>
                <p className="text-sm text-gray-500">Nos renovamos cada temporada para traerte lo mejor del mercado.</p>
              </div>
            </div>
          </div>

          {/* Foto dueños a la derecha */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary translate-x-4 translate-y-4 rounded-2xl z-0"></div>
            <div className="relative z-10 h-[300px] lg:h-[550px] w-full rounded-2xl overflow-hidden shadow-xl border-2 border-accent/30 bg-surface flex items-center justify-center">
              {/* Placeholder — reemplazar con foto real de los dueños */}
              <div className="text-center p-8">
                <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-accent/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h3 className="font-display text-2xl font-bold text-primary mb-2">Los fundadores</h3>
                <p className="text-gray-400 text-sm">Foto de los dueños próximamente</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALORES */}
      <section className="bg-primary text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold mb-4">Lo que nos mueve</h2>
            <div className="w-24 h-1 bg-accent mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div>
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">Precio Justo</h3>
              <p className="text-gray-400">Creemos fervientemente que la ropa duradera y presentable tiene que entrar en el presupuesto del laburante mensual.</p>
            </div>
            <div>
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">Calidad Tangible</h3>
              <p className="text-gray-400">Seleccionamos cada proveedor asegurándonos de que la costura, el despunte y la tela aguanten la vida diaria real.</p>
            </div>
            <div>
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">Trato Cercano</h3>
              <p className="text-gray-400">Te recibimos en el local te asesoramos. Sin respuestas copiadas, sin chatbots que no entienden. Hablás con dueños y empleados reales.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NUESTRAS REDES */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-3 block">Seguinos</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">Nuestras Redes</h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
            <p className="text-gray-500 max-w-lg mx-auto">
              Mirá cómo trabajamos, qué hay de nuevo y cómo vestimos a miles de personas cada semana.
            </p>

            {/* Social links */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <a
                href="https://www.instagram.com/elimperiodelamoda.cba/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-bold text-xs md:text-sm hover:scale-105 transition-all shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                @elimperiodelamoda.cba
              </a>
              <a
                href="https://www.tiktok.com/@elimperiodelamodacba"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-black text-white px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-bold text-xs md:text-sm hover:scale-105 transition-all shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.2a8.16 8.16 0 005.58 2.2V12a4.85 4.85 0 01-3.77-1.54V6.69h3.77z"/></svg>
                @elimperiodelamodacba
              </a>
            </div>
          </div>

          {/* Instagram Reels */}
          <div className="mb-12">
            <h3 className="font-display text-xl font-bold text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </span>
              Instagram Reels
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "DXsJOl4kckt",
                "DXkMM23kZs-",
                "DWl5Xq6kXUp",
                "DPRXwjokZaq",
              ].map((reelId) => (
                <div key={reelId} className="relative rounded-2xl overflow-hidden shadow-lg border border-border bg-white aspect-[9/16]">
                  <iframe
                    src={`https://www.instagram.com/reel/${reelId}/embed/`}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    scrolling="no"

                    loading="lazy"
                    title={`Instagram Reel ${reelId}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* TikTok Videos */}
          <div>
            <h3 className="font-display text-xl font-bold text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.2a8.16 8.16 0 005.58 2.2V12a4.85 4.85 0 01-3.77-1.54V6.69h3.77z"/></svg>
              </span>
              TikTok
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "7618616101580131604",
                "7616380648416185621",
                "7634877388190453013",
                "7634732293671734548",
              ].map((videoId) => (
                <div key={videoId} className="relative rounded-2xl overflow-hidden shadow-lg border border-border bg-black aspect-[9/16]">
                  <iframe
                    src={`https://www.tiktok.com/embed/v2/${videoId}?autoplay=0&mute=1`}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    scrolling="no"
                    allow="encrypted-media"
                    loading="lazy"
                    title={`TikTok Video ${videoId}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAPA Y LOCAL */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="bg-surface rounded-3xl overflow-hidden shadow-sm border border-border flex flex-col md:flex-row">
          <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
            <h2 className="font-display text-3xl font-bold text-primary mb-6">Dónde encontrarnos</h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <div>
                  <h4 className="font-bold text-primary">Dirección Central</h4>
                  <p className="text-gray-600">San Martín 390, X5000 Córdoba, Prov. de Córdoba.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                  <h4 className="font-bold text-primary">Horarios</h4>
                  <p className="text-gray-600">Lunes a Viernes de 09:00 a 18:00 hs.<br/>Sábados de 09:00 a 13:00 hs.</p>
                </div>
              </div>
            </div>
            
            <a 
              href="https://maps.google.com/?q=San+Martin+390,+Cordoba,+Argentina" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary text-white w-fit px-8 py-3 rounded-radius-base font-bold hover:bg-opacity-90 transition-colors"
            >
              Cómo llegar
            </a>
          </div>
          
          <div className="h-[400px] md:h-auto md:w-1/2 relative bg-gray-200">
             <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.088016260303!2d-64.18209089999999!3d-31.411700999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94329900394bea4f%3A0x5dbf4ea4a080b1e4!2sImperio%20de%20la%20Moda!5e0!3m2!1ses-419!2sar!4v1773808575777!5m2!1ses-419!2sar" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Imperio de la Moda"
              className="absolute inset-0"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
