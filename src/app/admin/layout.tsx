import { Metadata } from "next";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";
import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin - Imperio de la Moda",
  description: "Panel de administración",
  robots: { index: false, follow: false },
};

// TODO v2.0: NextAuth session check aquí

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminThemeProvider>
      <AdminLayoutWrapper>
        {children}
      </AdminLayoutWrapper>
    </AdminThemeProvider>
  );
}
