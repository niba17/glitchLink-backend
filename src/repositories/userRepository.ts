// src/repositories/userRepository.ts
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: { email: string; password: string }): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
      },
    });
  }

  async delete(id: number): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}
