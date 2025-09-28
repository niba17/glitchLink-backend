// backend/src/services/userService.ts
import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/userRepository";
import { RegisterUserDto, LoginUserDto } from "../DTOs/userDTO";
import type { User } from "@prisma/client";
import { ConflictError, CredentialError, NotFoundError } from "../utils/errors";
import { generateJwt } from "../utils/jwt";

type UserWithoutPassword = Pick<User, "id" | "email">;

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(
    userData: RegisterUserDto
  ): Promise<{ token: string; user: UserWithoutPassword }> {
    const { email, password } = userData;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError("Conflict error", [
        { path: "email", message: "Email already in use" },
      ]);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
    });

    // langsung generate token, sama seperti loginUser
    const token = generateJwt(newUser);

    return { token, user: this.excludePassword(newUser) };
  }

  async loginUser(
    userData: LoginUserDto
  ): Promise<{ token: string; user: UserWithoutPassword }> {
    const { email, password } = userData;

    const user = await this.userRepository.findByEmail(email);
    const passwordValid =
      user && (await bcrypt.compare(password, user.password));

    if (!user || !passwordValid) {
      throw new CredentialError("Invalid credential", ["email", "password"]);
    }

    const token = generateJwt(user);

    return { token, user: this.excludePassword(user) };
  }

  async getUserById(id: number): Promise<UserWithoutPassword> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User");
    }
    return this.excludePassword(user);
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }
    await this.userRepository.delete(userId);
  }

  private excludePassword(user: User): UserWithoutPassword {
    const { password: _, ...rest } = user;
    return rest;
  }
}
