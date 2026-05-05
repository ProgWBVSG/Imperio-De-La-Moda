"use client";

import { useEffect } from "react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export default function SizeGuideModal({ isOpen, onClose, category = "" }: SizeGuideModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isPants = category.toLowerCase().includes("pantalon") || category.toLowerCase().includes("jean");

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface">
          <h2 className="text-xl font-bold text-primary font-display flex items-center gap-2">
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
            Guía de Talles {isPants ? "Inferior" : "Superior"}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-100"
            aria-label="Cerrar guía de talles"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <p className="text-sm text-gray-600 mb-6">
            Te sugerimos medir una prenda tuya que te quede bien y compararla con estas medidas aproximadas. Las medidas están expresadas en centímetros y están tomadas con la prenda apoyada sobre una superficie plana.
          </p>

          {isPants ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-surface text-primary">
                  <tr>
                    <th className="px-4 py-3 font-bold rounded-tl-lg">Talle</th>
                    <th className="px-4 py-3 font-bold">Cintura (A)</th>
                    <th className="px-4 py-3 font-bold">Cadera (B)</th>
                    <th className="px-4 py-3 font-bold rounded-tr-lg">Largo Total (C)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-primary">S (36/38)</td>
                    <td className="px-4 py-3 text-gray-600">36 - 38 cm</td>
                    <td className="px-4 py-3 text-gray-600">46 - 48 cm</td>
                    <td className="px-4 py-3 text-gray-600">98 - 100 cm</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-primary">M (40)</td>
                    <td className="px-4 py-3 text-gray-600">39 - 40 cm</td>
                    <td className="px-4 py-3 text-gray-600">49 - 50 cm</td>
                    <td className="px-4 py-3 text-gray-600">100 - 102 cm</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-primary">L (42)</td>
                    <td className="px-4 py-3 text-gray-600">41 - 42 cm</td>
                    <td className="px-4 py-3 text-gray-600">51 - 52 cm</td>
                    <td className="px-4 py-3 text-gray-600">102 - 104 cm</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-primary">XL (44/46)</td>
                    <td className="px-4 py-3 text-gray-600">43 - 45 cm</td>
                    <td className="px-4 py-3 text-gray-600">53 - 55 cm</td>
                    <td className="px-4 py-3 text-gray-600">104 - 106 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-surface text-primary">
                  <tr>
                    <th className="px-4 py-3 font-bold rounded-tl-lg">Talle</th>
                    <th className="px-4 py-3 font-bold">Pecho/Sisa (A)</th>
                    <th className="px-4 py-3 font-bold">Hombros (B)</th>
                    <th className="px-4 py-3 font-bold rounded-tr-lg">Largo Total (C)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-primary">S</td>
                    <td className="px-4 py-3 text-gray-600">48 - 50 cm</td>
                    <td className="px-4 py-3 text-gray-600">42 - 44 cm</td>
                    <td className="px-4 py-3 text-gray-600">68 - 70 cm</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-primary">M</td>
                    <td className="px-4 py-3 text-gray-600">51 - 53 cm</td>
                    <td className="px-4 py-3 text-gray-600">45 - 46 cm</td>
                    <td className="px-4 py-3 text-gray-600">70 - 72 cm</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-primary">L</td>
                    <td className="px-4 py-3 text-gray-600">54 - 56 cm</td>
                    <td className="px-4 py-3 text-gray-600">47 - 48 cm</td>
                    <td className="px-4 py-3 text-gray-600">72 - 74 cm</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-primary">XL</td>
                    <td className="px-4 py-3 text-gray-600">57 - 59 cm</td>
                    <td className="px-4 py-3 text-gray-600">49 - 50 cm</td>
                    <td className="px-4 py-3 text-gray-600">74 - 76 cm</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-primary">XXL</td>
                    <td className="px-4 py-3 text-gray-600">60 - 62 cm</td>
                    <td className="px-4 py-3 text-gray-600">51 - 52 cm</td>
                    <td className="px-4 py-3 text-gray-600">76 - 78 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Tips Box */}
          <div className="mt-8 bg-accent/5 border border-accent/20 p-4 rounded-xl">
            <h4 className="font-bold text-primary text-sm mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tené en cuenta
            </h4>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
              <li>Las medidas son referenciales y pueden variar +- 2cm por el proceso de confección.</li>
              <li>Si estás entre dos talles y preferís un calce suelto (oversize), te recomendamos elegir el talle más grande.</li>
              <li>Para prendas con elástico (como buzos o joggers), la medida es sin estirar.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
