
import Link from "next/link";
import { notFound } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { CakeImage } from "@/components/CakeCard";
import { brl, waLink } from "@/lib/config";
import { WhatsApp } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function Produto({ params }) {
  const { id } = await params;

  const { data: product, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar bolo:", error);
    throw new Error("Não foi possível carregar o bolo.");
  }

  if (!product) {
    notFound();
  }

  return (
    <section className="page detail">

      <Link href="/" className="back">
        ‹ Voltar aos produtos
      </Link>

      <div className="detail-grid">

        <div className="detail-img">
          <CakeImage
            src={product.image}
            alt={product.name}
          />
        </div>

        <div>
          <h1 className="script page-title left">
            {product.name}
          </h1>

          <p className="price big">
            {brl(product.price)}
          </p>

          <p className="desc">
            {product.description}
          </p>

          <a
            className="btn wa"
            href={waLink(
              `Olá! Gostaria de encomendar o ${product.name} (${brl(product.price)}).`
            )}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsApp /> Encomendar pelo WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}