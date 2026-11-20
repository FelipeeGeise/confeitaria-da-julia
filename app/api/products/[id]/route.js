import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// EXCLUIR BOLO
export async function DELETE(req, { params }) {
  if (!isAdmin()) {
    return NextResponse.json(
      { error: "Não autorizado." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      console.error("Erro ao excluir bolo:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Bolo não encontrado." },
        { status: 404 }
      );
    }

    revalidatePath("/");
    revalidatePath("/produtos");
    revalidatePath(`/produtos/${id}`);

    return NextResponse.json({
      ok: true,
      message: "Bolo excluído com sucesso!"
    });

  } catch (error) {
    console.error("Erro na exclusão:", error);

    return NextResponse.json(
      { error: "Erro interno ao excluir o bolo." },
      { status: 500 }
    );
  }
}

// EDITAR PRODUTO
export async function PUT(req, { params }) {
  if (!isAdmin()) {
    return NextResponse.json(
      { error: "Não autorizado." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const updates = {};

    if (body.name !== undefined) {
      updates.name = body.name;
    }

    if (body.price !== undefined) {
      const price = Number(body.price);

      if (!Number.isFinite(price) || price <= 0) {
        return NextResponse.json(
          { error: "Preço inválido." },
          { status: 400 }
        );
      }

      updates.price = price;
    }

    if (body.description !== undefined) {
      updates.description = body.description;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Nenhuma alteração informada." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .update(updates)
      .eq("id", id)
      .select("id");

    if (error) {
      console.error("Erro ao atualizar produto:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Bolo não encontrado." },
        { status: 404 }
      );
    }

    revalidatePath("/");
    revalidatePath("/produtos");
    revalidatePath(`/produtos/${id}`);

    return NextResponse.json({
      ok: true,
      message: "Produto atualizado com sucesso!"
    });

  } catch (error) {
    console.error("Erro ao atualizar produto:", error);

    return NextResponse.json(
      { error: "Erro interno ao atualizar o produto." },
      { status: 500 }
    );
  }
}