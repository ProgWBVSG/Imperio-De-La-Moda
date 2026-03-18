import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Conocé nuestra historia',
  description: 'Imperio de la Moda: precio justo, calidad real y trato cercano. Ubicados en San Martín 390, Córdoba.',
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
                Sabemos lo difícil que es emprender en Argentina. Por eso no solo vendemos ropa, sino que damos herramientas, charlas y asesoramiento para que quienes compran por mayor, puedan armar su propio negocio rentable y salir adelante en su ciudad.
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
                src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop"
                alt="Frente local Imperio de la Moda"
                fill
                className="object-cover"
              />
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
