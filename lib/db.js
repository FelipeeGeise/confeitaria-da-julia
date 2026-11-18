import fs from "fs/promises";
import path from "path";
const file = path.join(process.cwd(), "data", "db.json");
export const uploadsDir = path.join(process.cwd(), "data", "uploads");
export async function readDB() {
  try { return JSON.parse(await fs.readFile(file, "utf8")); }
  catch { return { products: [], messages: [] }; }
}
export async function writeDB(db) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(db, null, 2));
}
