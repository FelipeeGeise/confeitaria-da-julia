import { readDB } from "@/lib/db";
import CakeCard from "@/components/CakeCard";
export const dynamic = "force-dynamic";
export const metadata = { title: "Produtos | Confeitaria da Júlia" };
export default async function Produtos() {
  const { products } = await readDB();
  return (
    <section className="page">
      <h1 className="script page-title">Nossos bolos</h1>
      {products.length ? <div className="grid">{products.map((p) => <CakeCard key={p.id} p={p} />)}</div> : <p className="empty">Nenhum bolo cadastrado ainda.</p>}
    </section>
  );
}
