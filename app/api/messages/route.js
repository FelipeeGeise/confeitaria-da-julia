import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar mensagens:", error);
      return NextResponse.json(
        { error: "Não foi possível carregar as mensagens." },
        { status: 500 }
      );
    }

    const formatted = (data || []).map((msg) => ({
      ...msg,
      createdAt: msg.created_at,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar mensagens." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { name, phone, text } = await req.json();

    if (!name?.trim() || !phone?.trim() || !text?.trim()) {
      return NextResponse.json(
        { error: "Preencha todos os campos." },
        { status: 400 }
      );
    }

    const newMessage = {
      id: crypto.randomUUID(),
      name: name.trim().slice(0, 80),
      phone: phone.trim().slice(0, 20),
      text: text.trim().slice(0, 1000),
      reply: null,
    };

    const { error } = await supabaseAdmin
      .from("messages")
      .insert(newMessage);

    if (error) {
      console.error("Erro ao salvar mensagem:", error);
      return NextResponse.json(
        { error: "Não foi possível enviar a mensagem." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return NextResponse.json(
      { error: "Erro interno ao enviar a mensagem." },
      { status: 500 }
    );
  }
}