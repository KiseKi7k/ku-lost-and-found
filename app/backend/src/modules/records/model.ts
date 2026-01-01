import { t } from "elysia";
import { UsersModel } from "../users/model";
import ApiResponse from "@/utils/apiResponse";

export namespace RecordsModel {

  export const record = t.Object({
    id: t.String(),
    reporter: UsersModel.user,
    image: t.Nullable(
      t.Object({
        imgUrl: t.String(),
      })
    ),
    claim: t.Nullable(
      t.Object({
        claimer: UsersModel.user,
        createdAt: t.Date(),
      })
    ),
    itemName: t.String(),
    foundLocation: t.String(),
    foundAt: t.Date(),
    depositLocation: t.String(),
    claimed: t.Boolean(),
  });
  export type record = typeof record.static;

  export const recordsPagination = t.Object({
    page: t.Number(),
    limit: t.Number(),
    records: t.Array(record),
  });
  export type recordsPagination = typeof recordsPagination.static;

  export const recordsQuery = t.Object({
    q: t.Optional(t.String()),
    claimed: t.Optional(t.Boolean()),
    foundLocation: t.Optional(t.String()),
    foundSince: t.Optional(t.Date()),
    sort: t.Optional(t.String()),
    order: t.Optional(t.Union([t.Literal("desc"), t.Literal("asc")])),
    page: t.Optional(t.Number()),
    limit: t.Optional(t.Number()),
  });
  export type recordsQuery = typeof recordsQuery.static;

  export const createRecordBody = t.Object({
    itemName: t.String(),
    imgUrl: t.String(),
    foundLocation: t.String(),
    foundAt: t.Date(),
    depositLocation: t.String(),
  });
  export type createRecordBody = typeof createRecordBody.static;

  export const editRecordBody = t.Object({
    itemName: t.Optional(t.String()),
    imgUrl: t.Optional(t.String()),
    foundLocation: t.Optional(t.String()),
    foundAt: t.Optional(t.Date()),
    depositLocation: t.Optional(t.String()),
  });
  export type editRecordBody = typeof editRecordBody.static;

  export const recordNotFound = ApiResponse.error("Record not found")
  export type recordNotFound = typeof recordNotFound.static

  export const unauthorized = ApiResponse.error("Unauthorized")
  export type unauthorized = typeof unauthorized.static

  export const noPermission = ApiResponse.error("No permission")
  export type noPermission = typeof noPermission.static
}
