import { Logo, Instagram, WhatsApp, Facebook } from "./Icons";
import { STORE, waLink } from "@/lib/config";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand"><Logo size={56} /><div><strong className="script">{STORE.name}</strong><p className="script">{STORE.slogan}</p></div></div>
        <div><h4>Contato</h4><p>{STORE.whatsappLabel}</p><p>{STORE.instagramHandle}</p></div>
        <div><h4>Endereço</h4><p>{STORE.address}</p></div>
        <div><h4>Informações</h4><p>✓ Entregas em toda a região</p><p>✓ Encomendas personalizadas</p><p>✓ Qualidade garantida</p></div>
        <div><h4>Acompanhe nossas redes</h4>
          <div className="socials big">
            <a href={STORE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a>
            <a href={waLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsApp /></a>
            <a href={STORE.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook /></a>
          </div>
        </div>
      </div>
      <p className="copy">© {new Date().getFullYear()} {STORE.name}. Todos os direitos reservados.</p>
    </footer>
  );
}
