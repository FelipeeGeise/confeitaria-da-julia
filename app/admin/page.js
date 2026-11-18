import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import AdminPanel from "@/components/AdminPanel";
export const dynamic = "force-dynamic";
export const metadata = { title: "Painel da Júlia", robots: { index: false } };
export default function Admin() {
  if (!isAdmin()) redirect("/admin/login");
  return <AdminPanel />;
}
