
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Carousel from "@/components/Carousel";
import HeroPhoto from "@/components/HeroPhoto";
import { STORE, waLink } from "@/lib/config";
import { WhatsApp } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar bolos do Supabase:", error);
    throw new Error("Não foi possível carregar os bolos.");
  }

  const productList = products ?? [];

  // TESTE: mostra no terminal os bolos recebidos do Supabase
  console.log(
    "BOLOS RECEBIDOS DO SUPABASE:",
    productList.map((p) => ({
      id: p.id,
      name: p.name,
    }))
  );

  return (
    <>
      <section className="hero">
        <HeroPhoto
          alt={`${STORE.owner}, confeiteira, apontando para um bolo`}
        />

        <div className="hero-in">
          <div className="hero-text">
            <h1 className="script">{STORE.phrase}</h1>

            <p>{STORE.phraseSub}</p>

            <a
              className="btn wa"
              href={waLink()}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsApp /> Fale comigo no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="showcase">
        <h2 className="script">{STORE.carouselPhrase}</h2>

        <Carousel products={productList} />
      </section>
    </>
  );
}
