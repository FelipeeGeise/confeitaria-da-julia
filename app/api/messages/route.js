import { NextResponse } from "next/server";
import crypto from "crypto";
import { readDB, writeDB } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const db = await readDB();
  return NextResponse.json(db.messages.slice().reverse());
}
export async function POST(req) {
  const { name, phone, text } = await req.json();
  if (!name?.trim() || !phone?.trim() || !text?.trim())
    return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
  const db = await readDB();
  db.messages.push({
    id: crypto.randomUUID(), name: name.trim().slice(0, 80), phone: phone.trim().slice(0, 20),
    text: text.trim().slice(0, 1000), createdAt: new Date().toISOString(), reply: null,
  });
  await writeDB(db);
  return NextResponse.json({ ok: true });
}
