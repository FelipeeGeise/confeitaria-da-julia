
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { brl } from "@/lib/config";
import { CakeImage } from "./CakeCard";

const toWa = (phone, text) => {
  let d = phone.replace(/\D/g, "");

  if (d.length <= 11) {
    d = "55" + d;
  }

  return `https://wa.me/${d}?text=${encodeURIComponent(text)}`;
};

export default function AdminPanel() {
  const router = useRouter();

  const [tab, setTab] = useState("messages");
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [note, setNote] = useState("");
  const [replying, setReplying] = useState(null);
  const [replyText, setReplyText] = useState("");

  const load = useCallback(async () => {
    try {
      const [p, m] = await Promise.all([
        fetch("/api/products", { cache: "no-store" }),
        fetch("/api/messages", { cache: "no-store" }),
      ]);

      if (!p.ok) {
        throw new Error("Não foi possível carregar os bolos.");
      }

      const productData = await p.json();
      const messageData = m.ok ? await m.json() : [];

      setProducts(Array.isArray(productData) ? productData : []);
      setMessages(Array.isArray(messageData) ? messageData : []);
    } catch (error) {
      console.error("Erro ao carregar painel:", error);
      setNote(error.message || "Erro ao carregar os dados.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addProduct(e) {
    e.preventDefault();

    const form = e.currentTarget;

    try {
      const r = await fetch("/api/products", {
        method: "POST",
        body: new FormData(form),
      });

      const d = await r.json();

      if (!r.ok) {
        setNote(d.error || "Não foi possível cadastrar o bolo.");
        return;
      }

      form.reset();
      setNote("Bolo publicado com sucesso!");

      await load();
      router.refresh();
    } catch (error) {
      console.error("Erro ao cadastrar bolo:", error);
      setNote("Erro ao cadastrar o bolo.");
    }
  }

  async function delProduct(id) {
    if (!confirm("Excluir este bolo?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setNote(data.error || "Não foi possível excluir o bolo.");
        return;
      }

      await load();

      router.refresh();

      setNote("Bolo excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir bolo:", error);
      setNote("Erro ao excluir o bolo. Tente novamente.");
    }
  }

  async function editPrice(p) {
    const v = prompt(`Novo preço para ${p.name}:`, p.price);

    if (v === null) return;

    const price = Number(v.replace(",", "."));

    if (!Number.isFinite(price) || price <= 0) {
      setNote("Informe um preço válido.");
      return;
    }

    try {
      const response = await fetch(`/api/products/${p.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price }),
      });

      const data = await response.json();

      if (!response.ok) {
        setNote(data.error || "Não foi possível atualizar o preço.");
        return;
      }

      await load();
      router.refresh();

      setNote("Preço atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar preço:", error);
      setNote("Erro ao atualizar o preço.");
    }
  }

  async function delMessage(id) {
    if (!confirm("Excluir esta mensagem?")) return;

    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setNote("Não foi possível excluir a mensagem.");
        return;
      }

      await load();
      setNote("Mensagem excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir mensagem:", error);
      setNote("Erro ao excluir a mensagem.");
    }
  }

  async function sendReply(m) {
    if (!replyText.trim()) return;

    try {
      const response = await fetch(`/api/messages/${m.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reply: replyText }),
      });

      if (!response.ok) {
        setNote("Não foi possível enviar a resposta.");
        return;
      }

      window.open(toWa(m.phone, replyText), "_blank");

      setReplying(null);
      setReplyText("");

      await load();
      setNote("Resposta registrada com sucesso!");
    } catch (error) {
      console.error("Erro ao responder mensagem:", error);
      setNote("Erro ao enviar a resposta.");
    }
  }

  async function logout() {
    await fetch("/api/auth", {
      method: "DELETE",
    });

    router.push("/admin/login");
    router.refresh();
  }

  return (
    <section className="page admin">
      <div className="admin-top">
        <h1 className="script">Painel da Júlia</h1>

        <button className="btn ghost" onClick={logout}>
          Sair
        </button>
      </div>

      <div className="stats">
        <div>
          <b>{products.length}</b>
          <span>Bolos</span>
        </div>

        <div>
          <b>{messages.length}</b>
          <span>Mensagens</span>
        </div>

        <div>
          <b>{messages.filter((m) => !m.reply).length}</b>
          <span>Sem resposta</span>
        </div>
      </div>

      <div className="tabs">
        <button
          className={tab === "messages" ? "on" : ""}
          onClick={() => setTab("messages")}
        >
          Mensagens
        </button>

        <button
          className={tab === "products" ? "on" : ""}
          onClick={() => setTab("products")}
        >
          Produtos
        </button>
      </div>

      {tab === "messages" && (
        <div className="list">
          {!messages.length && (
            <p className="empty">Nenhuma mensagem recebida ainda.</p>
          )}

          {messages.map((m) => (
            <article key={m.id} className="msg">
              <header>
                <strong>{m.name}</strong>
                <span>{m.phone}</span>
                <time>
                  {new Date(m.createdAt).toLocaleString("pt-BR")}
                </time>
              </header>

              <p>{m.text}</p>

              {m.reply && (
                <p className="replied">
                  <b>Sua resposta:</b> {m.reply}
                </p>
              )}

              {replying === m.id ? (
                <div className="reply-box">
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Escreva sua resposta..."
                  />

                  <div className="row">
                    <button
                      className="btn"
                      onClick={() => sendReply(m)}
                    >
                      Enviar pelo WhatsApp
                    </button>

                    <button
                      className="btn ghost"
                      onClick={() => setReplying(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <button
                    className="btn small"
                    onClick={() => {
                      setReplying(m.id);
                      setReplyText(m.reply || "");
                    }}
                  >
                    {m.reply ? "Responder de novo" : "Responder"}
                  </button>

                  <button
                    className="btn small danger"
                    onClick={() => delMessage(m.id)}
                  >
                    Excluir
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {tab === "products" && (
        <>
          <form className="add-form" onSubmit={addProduct}>
            <h2>Publicar novo bolo</h2>

            <label>
              Nome
              <input name="name" required />
            </label>

            <label>
              Preço (R$)
              <input
                name="price"
                required
                inputMode="decimal"
                placeholder="89,90"
              />
            </label>

            <label>
              Descrição
              <textarea name="description" rows={3} />
            </label>

            <label>
              Foto do bolo
              <input
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
              />
            </label>

            <button className="btn">Publicar bolo</button>

            {note && (
              <p className="form-msg ok" role="status">
                {note}
              </p>
            )}
          </form>

          <div className="list">
            {products.map((p) => (
              <article key={p.id} className="prod-row">
                <div className="thumb">
                  <CakeImage src={p.image} alt={p.name} />
                </div>

                <div className="grow">
                  <strong>{p.name}</strong>
                  <span className="price">{brl(p.price)}</span>
                </div>

                <button
                  className="btn small ghost"
                  onClick={() => editPrice(p)}
                >
                  Editar preço
                </button>

                <button
                  className="btn small danger"
                  onClick={() => delProduct(p.id)}
                >
                  Excluir
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
