import Elysia, { status, t } from "elysia";
import { prisma } from "@repo/db";
import { RecordsModel } from "./model";
import { Records } from "./service";
import jwt from "@elysiajs/jwt";

export const records = new Elysia({ prefix: "/records" })
  .use(
    jwt({
      secret: process.env.NEXTAUTH_SECRET!,
    })
  )
  .derive(async ({ jwt, headers }) => {
    const auth = headers["authorization"];
    if (!auth) return { userId: "" };
    const token = auth.replace("Bearer ", "");

    const payload = await jwt.verify(token);
    if (!payload) return { userId: "" };

    const userId = payload.userId as string;
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

  // Get records pagination and sort by createdAt
  .get(
    "/",
    async ({ query }) => {
      const records = await Records.getRecords(query);
      return records;
    },
    {
      query: RecordsModel.recordsQuery,
      response: {
        200: RecordsModel.recordsPagination,
      },
    }
  )

  // Get record by id
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const record = await Records.getRecord(id);
      return record;
    },
    {
      response: {
        200: RecordsModel.record,
        404: RecordsModel.recordNotFound,
      },
    }
  )

  // Create new record
  .post(
    "/",
    async ({ body, userId }) => {
      const record = await Records.createRecord(body, userId);
      return record;
    },
    {
      auth: true,
      body: RecordsModel.createRecordBody,
      response: {
        200: RecordsModel.record,
        401: RecordsModel.unauthorized,
      },
    }
  )

  // Edit record
  .patch(
    "/:id",
    async ({ params: { id }, body, userId }) => {
      const record = await Records.editRecord(id, body, userId!);
      return record;
    },
    {
      auth: true,
      body: RecordsModel.editRecordBody,
      response: {
        200: RecordsModel.record,
        401: RecordsModel.unauthorized,
        403: t.Literal("You don't have permission to edit this record."),
        404: RecordsModel.recordNotFound,
      },
    }
  )

  // Delete record
  .delete(
    "/:id",
    async ({ params: { id }, userId }) => {
      await Records.deleteRecord(id, userId!);
      return;
    },
    {
      auth: true,
      response: {
        200: t.Void(),
        401: RecordsModel.unauthorized,
        404: RecordsModel.recordNotFound,
      },
    }
  )

  // Claim and unclaim Record
  .post(
    "/:id/claim",
    async ({ params: { id }, userId }) => {
      await Records.claimRecord(id, userId!);
    },
    {
      auth: true,
      response: {
        200: t.Void(),
        401: RecordsModel.unauthorized,
        403: t.Literal(
          "You don't have permission to claim/unclaim this record."
        ),
        404: RecordsModel.recordNotFound,
      },
    }
  )