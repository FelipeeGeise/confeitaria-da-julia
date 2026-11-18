
import fs from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
import { createClient } from "@supabase/supabase-js";

loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error("Variáveis do Supabase não configuradas no .env.local.");
}

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const dataDir = path.join(process.cwd(), "data");
const dbFile = path.join(dataDir, "db.json");
const uploadsDir = path.join(dataDir, "uploads");

const bucket = "bolos";

const mimeTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function migrateProducts() {
  console.log("Iniciando migração dos produtos...");

  const content = await fs.readFile(dbFile, "utf8");
  const db = JSON.parse(content);

  if (!Array.isArray(db.products)) {
    throw new Error("A lista de produtos não foi encontrada no db.json.");
  }

  const migratedProducts = [];

  for (const product of db.products) {
    console.log(`Processando: ${product.name}`);

    let image = product.image || "";

    if (image.startsWith("/api/uploads/")) {
      const originalFileName = path.posix.basename(image);
      const extension = path.extname(originalFileName).toLowerCase();
      const contentType = mimeTypes[extension];

      if (!contentType) {
        throw new Error(`Formato não permitido: ${originalFileName}`);
      }

      const localFilePath = path.join(uploadsDir, originalFileName);
      const fileBuffer = await fs.readFile(localFilePath);

      const storagePath = `produtos/legado-${product.id}${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(storagePath, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        throw new Error(
          `Erro ao enviar imagem de ${product.name}: ${uploadError.message}`
        );
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(storagePath);

      image = data.publicUrl;

      console.log(`Imagem enviada: ${product.name}`);
    }

    migratedProducts.push({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description || "",
      image,
    });
  }

  const { error: databaseError } = await supabase
    .from("products")
    .upsert(migratedProducts, {
      onConflict: "id",
    });

  if (databaseError) {
    throw new Error(`Erro ao salvar produtos: ${databaseError.message}`);
  }

  console.log("--------------------------------");
  console.log("Migração concluída com sucesso!");
  console.log(`Total de produtos migrados: ${migratedProducts.length}`);
  console.log("--------------------------------");
}

migrateProducts().catch((error) => {
  console.error("Falha na migração:", error.message);
  process.exitCode = 1;
});
