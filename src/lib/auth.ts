import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "smkn10_makassar_sarpras_secret_key_super_secure_2026";
const key = new TextEncoder().encode(JWT_SECRET);

export interface TokenPayload {
  id: string;
  username: string;
  role: "ADMIN" | "GURU";
  nama_lengkap: string;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function signJwt(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyJwt(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getSessionUser(): Promise<TokenPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  return verifyJwt(token);
}

export async function requireAuth(allowedRoles?: ("ADMIN" | "GURU")[]): Promise<TokenPayload> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}
