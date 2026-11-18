"use client";
import Link from "next/link";
import { useState } from "react";
import { Logo, Instagram, WhatsApp, Facebook } from "./Icons";
import { STORE, waLink } from "@/lib/config";
export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="header">
      <div className="header-in">
        <Link href="/" className="brand" onClick={close}>
          <Logo size={42} />
          <span><strong className="script">{STORE.name}</strong><small className="script">{STORE.slogan}</small></span>
        </Link>
        <button className="burger" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
        <nav className={"nav" + (open ? " open" : "")}>
          <Link href="/" onClick={close}>Home</Link>
          <Link href="/produtos" onClick={close}>Produtos</Link>
          <Link href="/contato" onClick={close}>Contato</Link>
          <div className="socials">
            <a href={STORE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a>
            <a href={waLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsApp /></a>
            <a href={STORE.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook /></a>
          </div>
        </nav>
      </div>
    </header>
  );
}
