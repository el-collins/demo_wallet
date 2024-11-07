// src/services/userService.ts

import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import logger from "../utils/logger";
import { db } from "../config/database";
import { walletService } from "./walletService";
import { generateToken } from "../utils/jwt";

class UserService {
  async createUser(userData: Partial<User>) {
    try {
      return await db.transaction(async (trx) => {
        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password!, 10);


        // Check if email is already in use
        const existingUser = await trx("users")
          .where({ email: userData.email })
          .first();

        if (existingUser) {
          throw new Error("Email/user is already in use");
        }

        // Create user
        const user: User = {
          id: uuidv4(),
          email: userData.email!,
          firstName: userData.firstName!,
          lastName: userData.lastName!,
          password: hashedPassword,
          phoneNumber: userData.phoneNumber!,
          role: userData.role ? userData.role : "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await trx("users").insert(user);

        // Create wallet for user
        await walletService.createWallet(user.id, user.email, trx);

        

        return user;
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create user: ${error.message}`);
      } else {
        throw new Error("Failed to create user: Unknown error");
      }
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    try {
      const user = await this.validateCredentials(email, password);

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return { user, token };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to login: ${error.message}`);
      } else {
        throw new Error("Failed to login: Unknown error");
      }
    }
  }

  async getUserById(userId: string): Promise<User> {
    const user = await db("users").where({ id: userId }).first();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const updates: Partial<User> = {
      ...userData,
      updatedAt: new Date(),
    };

    if (userData.password) {
      updates.password = await bcrypt.hash(userData.password, 10);
    }

    const [updatedUser] = await db("users")
      .where({ id: userId })
      .update(updates)
      .returning("*");

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  }


  async validateCredentials(email: string, password: string): Promise<User> {
    const user = await db("users").where({ email }).first();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    return user;
  }

  // Generate NUBAN number
  private generateNubanNumber(): string {
    // Generate a random 10-digit number
    const nubanNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();
    return nubanNumber;
  }
}

export const userService = new UserService();
