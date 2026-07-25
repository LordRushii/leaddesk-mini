import { getSessionUser } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <AdminDashboard initialUser={user} />;
}
