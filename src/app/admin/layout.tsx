import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/guru");
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar user={{ nama_lengkap: user.nama_lengkap, username: user.username }} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
