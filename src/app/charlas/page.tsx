import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Charlas y Capacitaciones',
  description: 'Si otros ya salieron adelante, ¿por qué vos no podés? Sumate a las charlas de emprendimiento de Imperio de la Moda.',
};

export default function Charlas() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "543515555123";
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=Hola,%20quisiera%20reservar%20un%20lugar%20para%20la%20pr%C3%B3xima%20charla`;

  // Esto podría venir de BBDD en el futuro
  const proximasCharlas = [
    {
      id: 1,
      fecha: "Jueves 15 de Abril",
      hora: "19:00 hs",
      titulo: "Cómo empezar a revender desde cero",
      cupos: "Últimos 5 lugares",
    },
    {
      id: 2,
      fecha: "Sábado 25 de Mayo",
      hora: "17:00 hs",
      titulo: "¿Cómo administrar tus ganancias y escalar el negocio?",
      cupos: "Inscripción Abierta",
    }
  ];

  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* 1. HERO CHARLAS */}
      <section className="bg-primary text-white py-24 px-4 text-center border-b-[8px] border-accent">
        <div className="max-w-4xl mx-auto">
          <p className="text-accent tracking-widest uppercase font-bold text-sm mb-4">Capacitaciones Gratuitas</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Si otros ya salieron adelante,<br className="hidden md:block" /> 
            <span className="text-accent italic">¿por qué vos no podés?</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Imperio de la Moda no te abandona en la compra. Queremos verte triunfar. Por eso damos charlas presenciales para animar, motivar y educar sobre cómo vender ropa en Argentina.
          </p>
        </div>
      </section>

      {/* 2. ¿QUÉ APRENDERÁS? */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1000&auto=format&fit=crop"
              alt="Charla presencial Imperio de la Moda"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/20"></div>
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl border-l-4 border-accent">
              <p className="font-bold text-primary italic">"El miedo a fracasar te hace perder más plata que equivocarte intentándolo."</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-primary mb-4">Herramientas prácticas, no teoría vacía</h2>
              <div className="w-20 h-1 bg-accent mb-6"></div>
              <p className="text-gray-600 text-lg leading-relaxed">
                Nuestras reuniones están diseñadas para gente de a pie. Personas comunes que quieren que el peso rinda más o generar una fuente de ingreso secundaria (o primaria).
              </p>
            </div>
            
            <ul className="space-y-4">
              {[
                "Cómo elegir las prendas que mejor rotan según temporada.",
                "Estrategias para vender por estados de WhatsApp o Instagram.",
                "Cálculo de márgenes, precios de venta y reinversión.",
                "Mentalidad de emprendedor para no rendirte en el primer mes."
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="mt-1 bg-accent/20 text-accent rounded-full p-1 border border-accent">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="text-primary font-medium">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. FECHAS PRÓXIMAS */}
      <section className="bg-surface py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-primary mb-4">Próximas Fechas</h2>
            <div className="w-24 h-1 bg-accent mx-auto"></div>
          </div>
          
          <div className="space-y-6">
            {proximasCharlas.length > 0 ? (
              proximasCharlas.map((charla) => (
                <div key={charla.id} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row gap-6 md:items-center justify-between transition-transform hover:-translate-y-1">
                  <div className="flex items-center gap-6">
                    <div className="bg-primary text-white text-center p-4 rounded-xl min-w-[100px]">
                      <span className="block text-2xl font-bold text-accent">{charla.fecha.split(' ')[1]}</span>
                      <span className="block text-sm uppercase">{charla.fecha.split(' ')[3]}</span>
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-primary mb-2 {charla.titulo}">{charla.titulo}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {charla.hora}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-accent">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                          {charla.cupos}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-white text-center px-6 py-3 rounded-radius-base font-bold whitespace-nowrap hover:bg-opacity-90 transition-colors"
                  >
                    Guardar mi lugar
                  </a>
                </div>
              ))
            ) : (
              <div className="bg-white p-12 rounded-2xl text-center border border-border">
                <h3 className="font-display text-2xl font-bold text-primary mb-2">Por el momento no hay fechas confirmadas</h3>
                <p className="text-gray-500">Volvé a revisar pronto o escribinos por WhatsApp para enterarte antes que nadie.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIOS */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold text-primary mb-4">Experiencias Reales</h2>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
            <p className="text-gray-700 italic mb-6 text-lg">"Fui a la charla del mes pasado con muchísimo miedo porque no sabía cómo empezar. Me explicaron desde cómo calcular el costo, hasta cómo evitar que me claven. Arranqué con $30.000 y hoy ya dupliqué mi inversión."</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                C
              </div>
              <div>
                <p className="font-bold text-primary">Camila Rodríguez</p>
                <p className="text-sm text-accent font-medium">Asistió en Febrero 2026</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
            <p className="text-gray-700 italic mb-6 text-lg">"Hacía años que quería abrir un showcroom en mi casa pero siempre sentía que no era el momento o que no me iba a dar el dinero. En Imperio me enseñaron que con constancia y buen proveedor, todo se puede."</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                L
              </div>
              <div>
                <p className="font-bold text-primary">Lucas M.</p>
                <p className="text-sm text-accent font-medium">Asistió en Enero 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
