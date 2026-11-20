import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(_, { params }) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("messages")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      console.error("Erro ao excluir mensagem:", error);
      return NextResponse.json(
        { error: "Não foi possível excluir a mensagem." },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Mensagem não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro interno ao excluir mensagem:", error);
    return NextResponse.json(
      { error: "Erro interno ao excluir a mensagem." },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { reply } = await req.json();

    const cleanReply = typeof reply === "string" ? reply.trim() : "";

    if (!cleanReply) {
      return NextResponse.json(
        { error: "Digite uma resposta." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("messages")
      .update({
        reply: cleanReply,
        replied_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id");

    if (error) {
      console.error("Erro ao responder mensagem:", error);
      return NextResponse.json(
        { error: "Não foi possível salvar a resposta." },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Mensagem não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro interno ao responder mensagem:", error);
    return NextResponse.json(
      { error: "Erro interno ao responder a mensagem." },
      { status: 500 }
    );
  }
}