import { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";
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
      <AdminSidebar />
      <main className="min-h-screen md:ml-[240px] pb-20 md:pb-0">
        {children}
      </main>
    </AdminThemeProvider>
  );
}
