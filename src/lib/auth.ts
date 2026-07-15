import { cookies } from "next/headers";
import crypto from "crypto";

const getSecret = () =>
  process.env.ADMIN_PASSWORD ||
  process.env.NEXTAUTH_SECRET ||
  "default_admin_secret_key";

export function createAdminSessionToken(): string {
  const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const secret = getSecret();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(expiry.toString())
    .digest("hex");
  return `${expiry}.${signature}`;
}

export function verifyAdminSessionToken(token: string): boolean {
  try {
    const [expiryStr, signature] = token.split(".");
    if (!expiryStr || !signature) return false;

    const expiry = Number(expiryStr);
    if (isNaN(expiry) || expiry < Date.now()) return false;

    const secret = getSecret();
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(expiryStr)
      .digest("hex");

    const sigBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (sigBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");
    if (!sessionCookie || !sessionCookie.value) return false;
    return verifyAdminSessionToken(sessionCookie.value);
  } catch {
    return false;
  }
}
