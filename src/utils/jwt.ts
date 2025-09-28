import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;
export function generateJwt(user: User): string {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "3h",
  });
}
