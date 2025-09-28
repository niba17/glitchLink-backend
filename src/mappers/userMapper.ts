import type { User } from "@prisma/client";

export function mapUserToDto(user: User) {
  const { password, ...rest } = user;
  return rest;
}
