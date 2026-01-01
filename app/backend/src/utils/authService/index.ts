import Elysia, { status } from "elysia";
import jwt from "@elysiajs/jwt";
import { prisma } from "@repo/db";

export const authService = new Elysia()
  .use(
    jwt({
      secret: process.env["NEXTAUTH_SECRET"]!,
    })
  )
  .derive(async ({ jwt, headers }) => {
    const auth = headers["authorization"];
    if (!auth) return { userId: "" };
    const token = auth.replace("Bearer ", "");

    const payload = await jwt.verify(token);
    if (!payload) return { userId: "" };

    const userId = payload["userId"] as string;
    if (!userId) return { userId: "" };

    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
      },
    });

    return { userId: user?.id || "" };
  })

  .macro("auth", () => ({
    async beforeHandle({ userId }) {
      if (!userId) throw status(401);
    },
  }))
  .as("scoped");
