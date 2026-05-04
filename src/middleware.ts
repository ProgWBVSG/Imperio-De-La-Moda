import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  // Proteger todas las rutas dentro de /admin excepto el login mismo
  matcher: [
    "/admin",
    "/admin/configuracion",
    "/admin/pedidos/:path*",
    "/admin/productos/:path*",
    "/admin/promos/:path*",
    "/admin/stock/:path*",
    "/admin/testimonios/:path*"
  ],
};
