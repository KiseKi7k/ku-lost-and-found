import authService from "@/utils/authService";
import Elysia, { t } from "elysia";
import { RecordsModel } from "./model";
import { Records } from "./service";
import wrapSuccess from "@/utils/wrapSuccess";
import ApiResponse from "@/utils/apiResponse";

export const records = new Elysia({ prefix: "/records" })
  .use(authService)
  .use(wrapSuccess)

  // Get records pagination and sort by createdAt
  .get(
    "/",
    async ({ query, wrapSuccess }) => {
      const records = await Records.getRecords(query);
      return wrapSuccess(records)
    },
    {
      query: RecordsModel.recordsQuery,
      response: {
        200: ApiResponse.success(RecordsModel.recordsPagination),
      },
    }
  )

  // Get record by id
  .get(
    "/:id",
    async ({ params: { id }, wrapSuccess }) => {
      const record = await Records.getRecord(id);
      return wrapSuccess(record)
    },
    {
      response: {
        200: ApiResponse.success(RecordsModel.record),
        404: RecordsModel.recordNotFound,
      },
    }
  )

  // Create new record
  .post(
    "/",
    async ({ body, userId, wrapSuccess }) => {
      const record = await Records.createRecord(body, userId);
      return wrapSuccess(record)
    },
    {
      auth: true,
      body: RecordsModel.createRecordBody,
      response: {
        200: ApiResponse.success(RecordsModel.record),
        401: RecordsModel.unauthorized,
      },
    }
  )

  // Edit record
  .patch(
    "/:id",
    async ({ params: { id }, body, userId, wrapSuccess }) => {
      const record = await Records.editRecord(id, body, userId!);
      return wrapSuccess(record)
    },
    {
      auth: true,
      body: RecordsModel.editRecordBody,
      response: {
        200: ApiResponse.success(RecordsModel.record),
        401: RecordsModel.unauthorized,
        403: RecordsModel.noPermission,
        404: RecordsModel.recordNotFound,
      },
    }
  )

  // Delete record
  .delete(
    "/:id",
    async ({ params: { id }, userId, wrapSuccess }) => {
      await Records.deleteRecord(id, userId!);
      return wrapSuccess(null, "Deleted successfully")
    },
    {
      auth: true,
      response: {
        200: ApiResponse.success(t.Null()),
        401: RecordsModel.unauthorized,
        404: RecordsModel.recordNotFound,
      },
    }
  )

  // Claim and unclaim Record
  .post(
    "/:id/claim",
    async ({ params: { id }, userId, wrapSuccess }) => {
      const claimed = await Records.claimRecord(id, userId);
      const message = claimed ? "Claimed successfully" : "Unclaimed successfully" as const
      return wrapSuccess(claimed, message)
    },
    {
      auth: true,
      response: {
        200: ApiResponse.success(t.Boolean()),
        401: RecordsModel.unauthorized,
        403: RecordsModel.noPermission,
        404: RecordsModel.recordNotFound,
      },
    }
  );
