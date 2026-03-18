"use client";

import { useState, useRef, useEffect } from "react";

// --- ÁRBOL DE CONVERSACIÓN GUIADO ---
interface ChatNode {
  botMessage: string;
  options: { label: string; nextId: string }[];
}

const chatTree: Record<string, ChatNode> = {
  start: {
    botMessage: "¡Hola! 👋 Soy Carlos, tu asistente en Imperio de la Moda. Estoy acá para resolver todas tus dudas. ¿Qué te gustaría saber?",
    options: [
      { label: "💰 Precios y promociones", nextId: "precios" },
      { label: "👗 Tipos de ropa disponible", nextId: "ropa" },
      { label: "🏬 Información del local", nextId: "local" },
      { label: "📦 Compras por mayor", nextId: "mayorista" },
      { label: "🚚 Envíos", nextId: "envios" },
    ],
  },

  // --- RAMA: PRECIOS ---
  precios: {
    botMessage: "¡Buena pregunta! Nuestros precios van desde $4.000 hasta $20.000 ARS. Tenemos precios especiales para mayoristas. ¿Qué te interesa más?",
    options: [
      { label: "Ver precios mayoristas", nextId: "precios_mayorista" },
      { label: "Ver precios minoristas", nextId: "precios_minorista" },
      { label: "¿Tienen promociones?", nextId: "promos" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },
  precios_mayorista: {
    botMessage: "Comprando por mayor (mínimo 6 prendas surtidas), accedés a descuentos de hasta el 40% sobre el precio minorista. Por ejemplo, una campera de $25.000 la conseguís a $18.000. 🔥",
    options: [
      { label: "¿Cómo compro por mayor?", nextId: "mayorista" },
      { label: "¿Qué prendas tienen?", nextId: "ropa" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },
  precios_minorista: {
    botMessage: "Como minorista podés comprar cualquier cantidad sin mínimo. Los precios están publicados en nuestro catálogo online y podés pagar en efectivo, transferencia o tarjeta.",
    options: [
      { label: "💳 Métodos de pago", nextId: "pagos" },
      { label: "Ver el catálogo", nextId: "catalogo" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },
  promos: {
    botMessage: "¡Siempre tenemos algo! 🎉 Seguinos en @imperiolamoda en Instagram y TikTok para enterarte primero de liquidaciones y promociones semanales. También hacemos descuento extra por pago en efectivo (10% adicional).",
    options: [
      { label: "💰 Descuento por efectivo", nextId: "pagos" },
      { label: "📲 ¿Dónde los sigo?", nextId: "redes" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },

  // --- RAMA: ROPA ---
  ropa: {
    botMessage: "Tenemos de todo para vestirte de pies a cabeza 👗👔. ¿Qué categoría te interesa?",
    options: [
      { label: "👩 Ropa de Mujer", nextId: "ropa_mujer" },
      { label: "👨 Ropa de Hombre", nextId: "ropa_hombre" },
      { label: "👶 Ropa de Niños", nextId: "ropa_ninos" },
      { label: "👜 Accesorios", nextId: "ropa_accesorios" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },
  ropa_mujer: {
    botMessage: "En mujer manejamos: remeras, blusas, vestidos, jeans, calzas, camperas puffer, buzos y conjuntos. Todo en talles S a XL. ¿Querés ver algo específico?",
    options: [
      { label: "Ver catálogo completo", nextId: "catalogo" },
      { label: "💰 ¿Cuánto sale?", nextId: "precios" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },
  ropa_hombre: {
    botMessage: "Para hombre tenemos: remeras, camisas de lino, pantalones cargo, jeans, buzos y camperas. Talles M a XXL.",
    options: [
      { label: "Ver catálogo completo", nextId: "catalogo" },
      { label: "💰 ¿Cuánto sale?", nextId: "precios" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },
  ropa_ninos: {
    botMessage: "En niños manejamos buzos canguro, remeras estampadas, joggers y conjuntos deportivos. Talles del 4 al 14.",
    options: [
      { label: "Ver catálogo completo", nextId: "catalogo" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },
  ropa_accesorios: {
    botMessage: "Tenemos carteras tote bag, riñoneras, gorras, bufandas y cinturones. ¡Ideales para complementar tu look!",
    options: [
      { label: "Ver catálogo completo", nextId: "catalogo" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },

  // --- RAMA: LOCAL ---
  local: {
    botMessage: "📍 Estamos en San Martín 390, Córdoba Capital (X5000). ¿Qué necesitás saber?",
    options: [
      { label: "🕐 Horarios de atención", nextId: "horarios" },
      { label: "🗺️ Cómo llegar", nextId: "como_llegar" },
      { label: "📲 Redes sociales", nextId: "redes" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },
  horarios: {
    botMessage: "Nuestros horarios son:\n• Lunes a Viernes: 9:00 a 18:00\n• Sábados: 9:00 a 13:00\n• Domingos y feriados: Cerrado\n\n¡Te esperamos! 😊",
    options: [
      { label: "🗺️ ¿Cómo llego?", nextId: "como_llegar" },
      { label: "Quiero hablar con alguien", nextId: "whatsapp_final" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },
  como_llegar: {
    botMessage: "Estamos sobre calle San Martín al 390, a pocas cuadras de la Plaza San Martín. Si venís en colectivo, te quedan cerca las líneas que pasan por el centro. ¡Te esperamos!",
    options: [
      { label: "🕐 ¿En qué horario atienden?", nextId: "horarios" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },
  redes: {
    botMessage: "¡Seguinos para ver las últimas novedades!\n📸 Instagram: @imperiolamoda\n🎵 TikTok: @imperiolamoda\n\nSubimos contenido todas las semanas con prendas nuevas y tips de moda 💅",
    options: [
      { label: "Quiero hablar por WhatsApp", nextId: "whatsapp_final" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },

  // --- RAMA: MAYORISTA ---
  mayorista: {
    botMessage: "¡Genial que te interese vender! 💪 Nuestro programa mayorista funciona así:\n\n1️⃣ Elegís mínimo 6 prendas surtidas\n2️⃣ Accedés al precio mayorista (hasta 40% menos)\n3️⃣ Coordinamos envío o retiro en local\n\n¿Qué más querés saber?",
    options: [
      { label: "💳 Formas de pago", nextId: "pagos" },
      { label: "🚚 ¿Hacen envíos?", nextId: "envios" },
      { label: "¿Puedo revender online?", nextId: "revender" },
      { label: "Quiero hablar con alguien", nextId: "whatsapp_final" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },
  revender: {
    botMessage: "¡Por supuesto! Muchos de nuestros clientes revenden por Instagram, Facebook Marketplace y ferias locales. Te podemos dar fotos profesionales de las prendas para que las uses en tus publicaciones. 📸",
    options: [
      { label: "Quiero arrancar, hablemos", nextId: "whatsapp_final" },
      { label: "💰 ¿Cuánto margen dejo?", nextId: "precios_mayorista" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },
  pagos: {
    botMessage: "Aceptamos:\n• 💵 Efectivo (10% de descuento extra)\n• 📱 Transferencia bancaria / Mercado Pago\n• 💳 Tarjeta de débito y crédito\n\nPara mayoristas, también manejamos pago contra entrega en algunos casos.",
    options: [
      { label: "📦 ¿Cómo compro por mayor?", nextId: "mayorista" },
      { label: "Quiero comprar ahora", nextId: "whatsapp_final" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },

  // --- RAMA: ENVÍOS ---
  envios: {
    botMessage: "📦 Hacemos envíos a todo el país por OCA o Correo Argentino. El costo del envío depende de tu zona y lo coordinamos por WhatsApp. También podés retirar gratis en nuestro local de Córdoba.",
    options: [
      { label: "¿Cuánto tarda?", nextId: "envio_demora" },
      { label: "Retiro en local", nextId: "local" },
      { label: "Quiero coordinar un envío", nextId: "whatsapp_final" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },
  envio_demora: {
    botMessage: "Los envíos dentro de Córdoba llegan en 1-2 días hábiles. Al interior del país, entre 3 y 7 días hábiles dependiendo de la zona. ¡Te avisamos el tracking una vez que despachamos! 🚛",
    options: [
      { label: "Quiero coordinar un envío", nextId: "whatsapp_final" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },

  // --- NODO: CATÁLOGO ---
  catalogo: {
    botMessage: "Podés ver todas nuestras prendas actualizadas en nuestro catálogo online. ¡Hacé click en 'Ver catálogo' en el menú de arriba o te paso el link directo!",
    options: [
      { label: "💰 ¿Descuentos por mayor?", nextId: "mayorista" },
      { label: "Quiero hablar con alguien", nextId: "whatsapp_final" },
      { label: "⬅️ Volver al inicio", nextId: "volver" },
    ],
  },

  // --- NODO FINAL: WHATSAPP ---
  whatsapp_final: {
    botMessage: "¡Perfecto! 🙌 Te comunico directamente con nuestro equipo por WhatsApp. Hacé click en el botón verde flotante que está abajo a la derecha de la pantalla, o escribinos al número directamente. ¡Te esperamos!",
    options: [
      { label: "🔄 Tengo otra consulta", nextId: "volver" },
    ],
  },

  // --- NODO ESPECIAL: VOLVER (no repite saludo) ---
  volver: {
    botMessage: "¡Por supuesto! 😊 ¿Hay algo más en lo que te pueda ayudar?",
    options: [
      { label: "💰 Precios y promociones", nextId: "precios" },
      { label: "👗 Tipos de ropa disponible", nextId: "ropa" },
      { label: "🏬 Información del local", nextId: "local" },
      { label: "📦 Compras por mayor", nextId: "mayorista" },
      { label: "🚚 Envíos", nextId: "envios" },
      { label: "✅ No, ¡gracias!", nextId: "despedida" },
    ],
  },

  // --- NODO: DESPEDIDA ---
  despedida: {
    botMessage: "¡Genial! Fue un placer ayudarte. Si necesitás algo más, acá voy a estar. ¡Que tengas un lindo día! 😄✨",
    options: [
      { label: "🔄 Tengo otra consulta", nextId: "volver" },
    ],
  },
};

// --- COMPONENTE ---
interface Message {
  sender: "bot" | "user";
  text: string;
  options?: { label: string; nextId: string }[];
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mostrar burbuja de invitación después de 3s
  useEffect(() => {
    const bubbleTimer = setTimeout(() => setShowBubble(true), 3000);
    // Auto-abrir el chatbot después de 5s
    const openTimer = setTimeout(() => {
      setIsOpen(true);
      setShowBubble(false);
      setTimeout(() => setAnimateIn(true), 50);
    }, 5000);

    return () => { clearTimeout(bubbleTimer); clearTimeout(openTimer); };
  }, []);

  // Inicializar con mensaje de bienvenida al abrir
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        const node = chatTree["start"];
        setMessages([{ sender: "bot", text: node.botMessage, options: node.options }]);
        setIsTyping(false);
      }, 800);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleOpen = () => {
    setIsOpen(true);
    setShowBubble(false);
    setHasInteracted(true);
    setTimeout(() => setAnimateIn(true), 50);
  };

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  const handleOptionClick = (label: string, nextId: string) => {
    setHasInteracted(true);

    // Agregar respuesta del usuario
    const updatedMessages: Message[] = [
      ...messages.map((m) => ({ ...m, options: undefined })),
      { sender: "user" as const, text: label },
    ];
    setMessages(updatedMessages);

    // Respuesta del bot con efecto de typing
    setIsTyping(true);
    setTimeout(() => {
      const node = chatTree[nextId];
      if (node) {
        setCurrentNodeId(nextId);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: node.botMessage, options: node.options },
        ]);
      }
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Ventana de Chat */}
      {isOpen && (
        <div
          className={`bg-white w-[340px] shadow-2xl rounded-2xl border border-gray-200 overflow-hidden mb-4 flex flex-col transition-all duration-300 ${
            animateIn ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
          }`}
          style={{ height: "460px" }}
        >
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-lg shadow-lg">C</div>
              <div>
                <h3 className="font-bold leading-tight text-sm">Carlos — Asistente Virtual</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-[11px] text-gray-300">En línea</p>
                </div>
              </div>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors p-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className="flex flex-col gap-2" style={{ animation: "chatFadeIn 0.4s ease-out" }}>
                <div className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "bot" && (
                    <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-xs mr-2 mt-1 shrink-0 shadow">C</div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>

                {/* Opciones */}
                {msg.options && msg.options.length > 0 && (
                  <div className="flex flex-col gap-1.5 pl-9" style={{ animation: "chatSlideUp 0.3s ease-out" }}>
                    {msg.options.map((opt, j) => (
                      <button
                        key={j}
                        onClick={() => handleOptionClick(opt.label, opt.nextId)}
                        className="text-left text-[12px] font-medium text-primary bg-white border border-border rounded-xl px-3.5 py-2 hover:bg-accent hover:text-primary hover:border-accent transition-all duration-200 shadow-sm"
                        style={{ animationDelay: `${j * 80}ms`, animation: `chatSlideUp 0.3s ease-out ${j * 80}ms both` }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2" style={{ animation: "chatFadeIn 0.3s ease-out" }}>
                <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-xs shrink-0 shadow">C</div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full" style={{ animation: "typingDot 1.2s infinite 0s" }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full" style={{ animation: "typingDot 1.2s infinite 0.2s" }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full" style={{ animation: "typingDot 1.2s infinite 0.4s" }}></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-white border-t border-gray-100 text-center shrink-0">
            <p className="text-[10px] text-gray-400">Powered by Imperio de la Moda ✨</p>
          </div>
        </div>
      )}

      {/* Burbuja de invitación */}
      {!isOpen && showBubble && (
        <div
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 mb-3 max-w-[240px] relative cursor-pointer"
          onClick={handleOpen}
          style={{ animation: "chatBubblePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
        >
          <p className="text-[13px] text-gray-800 font-medium">
            ¡Hola! 👋 ¿Necesitás ayuda? Preguntame lo que sea
          </p>
          {/* Triangulito */}
          <div className="absolute -bottom-2 left-5 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
        </div>
      )}

      {/* Botón Flotante */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-accent"
          style={{ animation: "chatButtonEntry 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      )}

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes chatFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes chatBubblePop {
          from { opacity: 0; transform: scale(0.8) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes chatButtonEntry {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
