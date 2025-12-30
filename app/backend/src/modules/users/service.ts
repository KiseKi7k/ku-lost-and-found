import { prisma } from "@repo/db";
import { status } from "elysia";
import type { UsersModel } from "./model";

export abstract class Users {
  static async getUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });
    if (!user) {
      throw status(404, "User not found" satisfies UsersModel.userNotFound);
    }

    return user;
  }
}
