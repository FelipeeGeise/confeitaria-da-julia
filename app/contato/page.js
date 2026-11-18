import ContactForm from "@/components/ContactForm";
import { STORE, waLink } from "@/lib/config";
import { WhatsApp } from "@/components/Icons";

export const metadata = { title: "Contato | Confeitaria da Júlia" };

export default function Contato() {
  return (
    <section className="page">
      <h1 className="script page-title">Fale com a gente</h1>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <ContactForm />
        <p style={{ textAlign: "center", margin: "1.5rem 0 1rem" }}>Prefere conversar agora?</p>
        <div style={{ textAlign: "center" }}>
          <a className="btn wa" href={waLink()} target="_blank" rel="noreferrer">
            <WhatsApp /> Fale comigo no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}