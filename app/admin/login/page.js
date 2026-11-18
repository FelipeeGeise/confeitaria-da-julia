"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Icons";
export default function Login() {
  const router = useRouter();
  const [f, setF] = useState({ user: "", password: "" });
  const [err, setErr] = useState("");
  async function submit(e) {
    e.preventDefault(); setErr("");
    const r = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    if (r.ok) { router.push("/admin"); router.refresh(); } else setErr((await r.json()).error);
  }
  return (
    <section className="page login">
      <form className="login-box" onSubmit={submit}>
        <Logo size={56} />
        <h1 className="script">Painel da Júlia</h1>
        <p>Administre sua confeitaria com facilidade</p>
        <label>Usuário<input value={f.user} onChange={(e) => setF({ ...f, user: e.target.value })} required autoComplete="username" /></label>
        <label>Senha<input type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required autoComplete="current-password" /></label>
        <button className="btn">Entrar</button>
        {err && <p className="form-msg err">{err}</p>}
      </form>
    </section>
  );
}
