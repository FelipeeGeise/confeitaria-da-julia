import crypto from "crypto";
import { cookies } from "next/headers";
const user = () => process.env.ADMIN_USER || "julia";
const pass = () => process.env.ADMIN_PASSWORD || "julia123";
const secret = () => process.env.AUTH_SECRET || "dev-secret";
export const makeToken = () =>
  crypto.createHmac("sha256", secret()).update(user() + ":" + pass()).digest("hex");
export const checkLogin = (u, p) => u === user() && p === pass();
export function isAdmin() {
  const t = cookies().get("admin_token")?.value;
  return !!t && t === makeToken();
}
