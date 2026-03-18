import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Acceso Admin',
      credentials: {
        username: { label: "Usuario", type: "text", placeholder: "admin" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        const validUser = process.env.ADMIN_USERNAME || "benja";
        const validPass = process.env.ADMIN_PASSWORD || "123";
        
        if (
          credentials?.username === validUser &&
          credentials?.password === validPass
        ) {
          // Usuario válido
          return { id: "1", name: "Administrador Imperio" };
        }
        
        // Autenticación fallida
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET || "secreto_desarrollo_imperio",
});

export { handler as GET, handler as POST };
