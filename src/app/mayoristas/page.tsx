import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Comprá por Mayor y Revendé',
  description: 'Iniciá tu propio negocio vendiendo ropa de Imperio de la Moda. Precios mayoristas desde $4.000, sin envíos por ahora (retiro en Córdoba).',
};

export default function Mayoristas() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493512336795";
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=Hola,%20me%20interesa%20iniciar%20como%20mayorista`;

  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* 1. HERO */}
      <section className="bg-primary text-white py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Comprá al precio mayorista — <span className="text-accent italic">vendé con tu margen</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10">
            Convertite en revendedor de Imperio de la Moda y generá ingresos administrando tus propios horarios y rentabilidad.
          </p>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-whatsapp text-white px-8 py-4 rounded-radius-base font-bold text-lg hover:bg-opacity-90 transition-all shadow-[0_0_15px_rgba(37,211,102,0.3)] hover:scale-105"
          >
            Quiero ser revendedor
          </a>
        </div>
      </section>

      {/* 2. PASOS SIMPLES */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold text-primary mb-4">El modelo en 3 pasos simples</h2>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Línea conectora solo visible en desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border -z-10"></div>
          
          <div className="bg-white p-8 rounded-xl border border-border text-center shadow-sm relative z-0">
            <div className="w-16 h-16 bg-primary text-accent text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">1</div>
            <h3 className="font-display text-xl font-bold mb-3 text-primary">Elegís las prendas</h3>
            <p className="text-gray-600">Revisá nuestro catálogo online o vení personalmente al local en San Martín 390 a armar tu pedido inicial.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl border border-accent text-center shadow-md relative z-0 transform md:-translate-y-4">
            <div className="w-16 h-16 bg-accent text-primary text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">2</div>
            <h3 className="font-display text-xl font-bold mb-3 text-primary">Comprás al por mayor</h3>
            <p className="text-gray-600">Accedés a nuestro tarifario exclusivo (prendas de $4.000 a $20.000 ARS) cumpliendo con la cantidad mínima estipulada.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl border border-border text-center shadow-sm relative z-0">
            <div className="w-16 h-16 bg-primary text-accent text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">3</div>
            <h3 className="font-display text-xl font-bold mb-3 text-primary">Vendés y ganás</h3>
            <p className="text-gray-600">Publicás en tus redes o vendés a conocidos. Vos decidís tu margen de rentabilidad final sin ataduras.</p>
          </div>
        </div>
      </section>

      {/* 3. CONDICIONES */}
      <section className="bg-surface py-20 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 w-full order-2 md:order-1 relative h-[400px]">
             <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop"
              alt="Mayorista ropa por fardos"
              fill
              className="object-cover rounded-2xl shadow-lg"
            />
          </div>
          
          <div className="flex-1 space-y-8 order-1 md:order-2">
            <div>
              <h2 className="font-display text-3xl font-bold text-primary mb-2">Condiciones Claras</h2>
              <div className="w-16 h-1 bg-accent"></div>
            </div>
            
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="bg-primary p-1.5 rounded-full text-accent mt-1 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-primary">Compra Mínima</h4>
                  <p className="text-gray-600">Para acceder al precio mayorista debes cumplir con una compra inicial pequeña (consultar cupo vigente).</p>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <div className="bg-primary p-1.5 rounded-full text-accent mt-1 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-primary">Medios de Pago</h4>
                  <p className="text-gray-600">Aceptamos Efectivo en sucursal y Transferencia Bancaria.</p>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <div className="bg-primary p-1.5 rounded-full text-accent mt-1 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-primary">Retiro Local</h4>
                  <p className="text-gray-600">Por ahora no realizamos envíos logísticos por correo. Todo se retira por San Martín 390 (Córdoba) para que verifiques la calidad en el momento.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. FORMULARIO CONTACTO */}
      <section className="py-20 px-4 max-w-3xl mx-auto w-full text-center">
        <h2 className="font-display text-3xl font-bold text-primary mb-4">¿Te quedan dudas?</h2>
        <p className="text-gray-600 mb-8">Dejanos tus datos o tocá el botón directo para hablar con el dueño por WhatsApp y arreglar tu primera visita.</p>
        
        <form className="bg-white p-8 rounded-2xl shadow border border-border text-left space-y-6" action={whatsappUrl} method="get" target="_blank">
          {/* Se redirige al href de whatsapp pero usamos inputs controlados en cliente en el checkout final */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Tu Nombre</label>
              <input type="text" className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition" placeholder="Juan Pérez" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Ciudad o Localidad</label>
              <input type="text" className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition" placeholder="Córdoba Capital" required />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary mb-1">¿Tenés local propio o vendés por redes?</label>
            <select className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition bg-white" required>
              <option value="" disabled selected>Elegí una opción</option>
              <option value="local">Tengo local a la calle</option>
              <option value="redes">Vendo online (Instagram/Facebook)</option>
              <option value="arranco">Apenas estoy arrancando</option>
            </select>
          </div>
          
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-primary text-white py-4 rounded-radius-base font-bold text-lg hover:bg-opacity-90 transition-all block text-center mt-4"
          >
            Contactar vía WhatsApp
          </a>
          <p className="text-xs text-gray-400 text-center mt-4">
            Al hacer clic se abrirá WhatsApp y nadie guardará tus datos en nuestra base temporal. Respetamos tu privacidad.
          </p>
        </form>
      </section>
    </div>
  );
}
