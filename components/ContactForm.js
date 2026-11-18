"use client";
import { useState } from "react";
export default function ContactForm() {
  const [f, setF] = useState({ name: "", phone: "", text: "" });
  const [state, setState] = useState({ status: "idle", msg: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    setState({ status: "loading", msg: "" });
    try {
      const r = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setF({ name: "", phone: "", text: "" });
      setState({ status: "ok", msg: "Mensagem enviada! Responderemos em breve." });
    } catch (err) { setState({ status: "err", msg: err.message || "Não foi possível enviar. Tente novamente." }); }
  }
  return (
    <form className="contact-form" onSubmit={submit} id="contato">
      <h2>Deixe sua mensagem</h2>
      <label>Seu nome<input value={f.name} onChange={set("name")} required maxLength={80} autoComplete="name" /></label>
      <label>Telefone (WhatsApp)<input value={f.phone} onChange={set("phone")} required type="tel" placeholder="(81) 90000-0000" autoComplete="tel" /></label>
      <label>Sua mensagem<textarea value={f.text} onChange={set("text")} required rows={4} maxLength={1000} /></label>
      <button className="btn" disabled={state.status === "loading"}>{state.status === "loading" ? "Enviando..." : "Enviar mensagem"}</button>
      {state.msg && <p className={"form-msg " + state.status} role="status">{state.msg}</p>}
    </form>
  );
}
