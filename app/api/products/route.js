
import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";

import { isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

// Listar produtos diretamente do Supabase
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao buscar produtos:", error);

      return NextResponse.json(
        { error: "Não foi possível carregar os produtos." },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);

    return NextResponse.json(
      { error: "Não foi possível carregar os produtos." },
      { status: 500 }
    );
  }
}

// Cadastrar novo produto no Supabase
export async function POST(req) {
  if (!isAdmin()) {
    return NextResponse.json(
      { error: "Não autorizado." },
      { status: 401 }
    );
  }

  let uploadedFilePath = null;

  try {
    const form = await req.formData();

    const name = String(form.get("name") || "").trim();

    const price = Number(
      String(form.get("price") || "").replace(",", ".")
    );

    const description = String(
      form.get("description") || ""
    ).trim();

    const file = form.get("image");

    if (!name || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "Informe nome e preço válido." },
        { status: 400 }
      );
    }

    let image = "";

    // Enviar imagem para o Supabase Storage
    if (file instanceof File && file.size > 0) {
      const ext = path.extname(file.name).toLowerCase();

      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          { error: "Use imagem JPG, PNG ou WEBP." },
          { status: 400 }
        );
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Formato de imagem não permitido." },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "Imagem maior que 8 MB." },
          { status: 400 }
        );
      }

      const fileName = `${crypto.randomUUID()}${ext}`;

      uploadedFilePath = `produtos/${fileName}`;

      const { error: uploadError } =
        await supabaseAdmin.storage
          .from("bolos")
          .upload(uploadedFilePath, file, {
            contentType: file.type,
            upsert: false,
          });

      if (uploadError) {
        console.error("Erro no upload:", uploadError);

        uploadedFilePath = null;

        return NextResponse.json(
          { error: "Não foi possível enviar a imagem ao Supabase." },
          { status: 500 }
        );
      }

      const { data } = supabaseAdmin.storage
        .from("bolos")
        .getPublicUrl(uploadedFilePath);

      image = data.publicUrl;
    }

    // Salvar produto diretamente na tabela products
    const { error: databaseError } = await supabaseAdmin
      .from("products")
      .insert({
        id: crypto.randomUUID(),
        name,
        price,
        description,
        image,
      });

    if (databaseError) {
      console.error("Erro ao salvar produto:", databaseError);

      throw new Error("Não foi possível salvar o produto no Supabase.");
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Bolo cadastrado com sucesso!",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Erro ao cadastrar bolo:", error);

    // Remover imagem caso o cadastro não seja concluído
    if (uploadedFilePath) {
      const { error: removeError } =
        await supabaseAdmin.storage
          .from("bolos")
          .remove([uploadedFilePath]);

      if (removeError) {
        console.error("Erro ao remover imagem:", removeError);
      }
    }

    return NextResponse.json(
      { error: "Erro interno ao cadastrar o bolo." },
      { status: 500 }
    );
  }
}
