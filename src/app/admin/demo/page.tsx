"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DemoAccess() {
  const router = useRouter();
  const [status, setStatus] = useState("Ingresando a la prueba demo...");

  useEffect(() => {
    // Auto-login con credenciales demo
    signIn("credentials", {
      username: "benja",
      password: "123",
      redirect: false,
    }).then((res) => {
      if (res?.ok) {
        setStatus("✅ ¡Acceso exitoso! Redirigiendo...");
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 500);
      } else {
        setStatus("❌ Error al iniciar sesión. Intentando de nuevo...");
        // Retry una vez
        setTimeout(() => {
          signIn("credentials", {
            username: "benja",
            password: "123",
            redirect: false,
          }).then((res2) => {
            if (res2?.ok) {
              router.push("/admin");
              router.refresh();
            } else {
              setStatus("No se pudo acceder. Probá manualmente con user: benja / pass: 123");
            }
          });
        }, 1000);
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="bg-white p-10 rounded-2xl shadow-lg border border-border text-center max-w-md">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🔑</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-primary mb-2">Prueba Demo</h1>
        <p className="text-text-muted mb-6 text-sm">{status}</p>
        <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
