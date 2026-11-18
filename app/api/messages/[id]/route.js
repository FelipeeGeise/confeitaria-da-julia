import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
export async function DELETE(_, { params }) {
  if (!isAdmin()) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const db = await readDB();
  db.messages = db.messages.filter((m) => m.id !== params.id);
  await writeDB(db);
  return NextResponse.json({ ok: true });
}
export async function PATCH(req, { params }) {
  if (!isAdmin()) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { reply } = await req.json();
  const db = await readDB();
  const m = db.messages.find((x) => x.id === params.id);
  if (!m) return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
  m.reply = reply; m.repliedAt = new Date().toISOString();
  await writeDB(db);
  return NextResponse.json({ ok: true });
}
