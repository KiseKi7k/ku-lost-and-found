import Elysia, { t } from "elysia";
import { RecordsModel } from "./model";
import { Records } from "./service";
import { authService } from "../authService";

export const records = new Elysia({ prefix: "/records" })
  .use(authService)

  // Get records pagination and sort by createdAt
  .get(
    "/",
    async ({ query }) => {
      const records = await Records.getRecords(query);
      return {
        success: true,
        data: records,
        message: "",
      };
    },
    {
      query: RecordsModel.recordsQuery,
      response: {
        200: RecordsModel.apiResponse(RecordsModel.recordsPagination),
      },
    }
  )

  // Get record by id
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const record = await Records.getRecord(id);
      return {
        success: true,
        data: record,
        message: "",
      };
    },
    {
      response: {
        200: RecordsModel.apiResponse(RecordsModel.record),
        404: RecordsModel.recordNotFound,
      },
    }
  )

  // Create new record
  .post(
    "/",
    async ({ body, userId }) => {
      const record = await Records.createRecord(body, userId);
      return {
        success: true,
        message: "",
        data: record,
      };
    },
    {
      auth: true,
      body: RecordsModel.createRecordBody,
      response: {
        200: RecordsModel.apiResponse(RecordsModel.record),
        401: RecordsModel.unauthorized,
      },
    }
  )

  // Edit record
  .patch(
    "/:id",
    async ({ params: { id }, body, userId }) => {
      const record = await Records.editRecord(id, body, userId!);
      return {
        success: true,
        message: "",
        data: record,
      };
    },
    {
      auth: true,
      body: RecordsModel.editRecordBody,
      response: {
        200: RecordsModel.apiResponse(RecordsModel.record),
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
      return {
        success: true,
        message: "Delete successfully",
        data: null,
      };
    },
    {
      auth: true,
      response: {
        200: RecordsModel.apiResponse(t.Null()),
        401: RecordsModel.unauthorized,
        404: RecordsModel.recordNotFound,
      },
    }
  )

  // Claim and unclaim Record
  .post(
    "/:id/claim",
    async ({ params: { id }, userId }) => {
      const message = await Records.claimRecord(id, userId!);
      return {
        success: true,
        message,
        data: null,
      };
    },
    {
      auth: true,
      response: {
        200: RecordsModel.apiResponse(t.Null()),
        401: RecordsModel.unauthorized,
        403: t.Literal(
          "You don't have permission to claim/unclaim this record."
        ),
        404: RecordsModel.recordNotFound,
      },
    }
  );
