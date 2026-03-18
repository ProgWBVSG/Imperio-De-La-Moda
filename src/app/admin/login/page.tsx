// TODO v2.0: Implementar login con NextAuth.js
// Dejado vacío intencionalmente — v1.0 no tiene autenticación
// Ver: https://next-auth.js.org/getting-started/introduction

import Link from "next/link";

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--admin-bg)" }}>
      <div className="text-center p-8 rounded-xl" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--admin-accent)" }}>IMPERIO</h1>
        <p className="text-sm mb-6" style={{ color: "var(--admin-text-muted)" }}>Login deshabilitado en v1.0</p>
        <Link href="/admin" className="admin-btn admin-btn-primary admin-btn-lg">
          Ir al Dashboard →
        </Link>
      </div>
    </div>
  );
}
