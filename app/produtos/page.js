import CakeCard from "@/components/CakeCard";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Produtos | Confeitaria da Júlia" };

export default async function Produtos() {
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return (
      <section className="page">
        <h1 className="script page-title">Nossos bolos</h1>
        <p className="empty">Não foi possível carregar os bolos no momento.</p>
      </section>
    );
  }

  const list = products || [];

  return (
    <section className="page">
      <h1 className="script page-title">Nossos bolos</h1>
      {list.length ? (
        <div className="grid">
          {list.map((p) => (
            <CakeCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <p className="empty">Nenhum bolo cadastrado ainda.</p>
      )}
    </section>
  );
}