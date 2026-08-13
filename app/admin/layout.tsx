import AdminSidebar from "../components/shared/AdminSidebar";
import AdminLogoutButton from "../components/shared/AdminLogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#080808]">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-end border-b border-white/10 bg-[#0b0b0b] px-6 py-3">
          <AdminLogoutButton />
        </div>

        <main className="overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
