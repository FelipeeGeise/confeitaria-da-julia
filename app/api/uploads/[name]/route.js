import fs from "fs/promises";
import path from "path";
import { uploadsDir } from "@/lib/db";
const types = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
export async function GET(_, { params }) {
  const name = path.basename(params.name);
  try {
    const buf = await fs.readFile(path.join(uploadsDir, name));
    return new Response(buf, { headers: { "Content-Type": types[path.extname(name).toLowerCase()] || "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch { return new Response("Not found", { status: 404 }); }
}
