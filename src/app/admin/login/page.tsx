"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Usuario o contraseña incorrectos");
        setLoading(false);
      } else {
        // Redirigir al dashboard y forzar refresh para actualizar sesión
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("Error al intentar iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--admin-bg)" }}>
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--admin-accent)" }}>IMPERIO</h1>
          <p className="text-sm font-medium" style={{ color: "var(--admin-text-muted)" }}>Panel de Administración Seguro</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md text-sm font-medium bg-red-500/10 text-red-500 border border-red-500/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--admin-text)" }}>Usuario</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{ background: "var(--admin-bg)", color: "var(--admin-text)", border: "1px solid var(--admin-border)" }}
              placeholder="Ej: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--admin-text)" }}>Contraseña</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{ background: "var(--admin-bg)", color: "var(--admin-text)", border: "1px solid var(--admin-border)" }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold transition-all mt-4 flex justify-center items-center gap-2"
            style={{ 
              background: loading ? "var(--admin-border)" : "var(--admin-accent)", 
              color: loading ? "var(--admin-text-muted)" : "black"
            }}
          >
            {loading ? "Verificando..." : "Ingresar al Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
