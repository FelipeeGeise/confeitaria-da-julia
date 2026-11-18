import { NextResponse } from "next/server";
import { checkLogin, makeToken } from "@/lib/auth";
export async function POST(req) {
  const { user, password } = await req.json();
  if (!checkLogin(user, password)) return NextResponse.json({ error: "Usuário ou senha incorretos." }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", makeToken(), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 12, secure: process.env.NODE_ENV === "production" });
  return res;
}
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", "", { path: "/", maxAge: 0 });
  return res;
}
