import { t, type TSchema } from "elysia";

export namespace RecordsModel {
  const user = t.Object({
    id: t.String(),
    name: t.Nullable(t.String()),
    image: t.Nullable(t.String()),
    email: t.String(),
  });
  type user = typeof user.static;

  export const record = t.Object({
    id: t.String(),
    reporter: user,
    image: t.Nullable(
      t.Object({
        imgUrl: t.String(),
      })
    ),
    claim: t.Nullable(
      t.Object({
        claimer: user,
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
    data: t.Array(record),
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

  export const recordNotFound = t.Literal("Record not found");
  export type recordNotFound = typeof recordNotFound.static;

  export const unauthorized = t.Literal("Unauthorized");
  export type unauthorized = typeof unauthorized.static;

  export const apiResponse = <T extends TSchema>(dataSchema: T) =>
    t.Object({
      success: t.Literal(true),
      message: t.String(),
      data: dataSchema,
    });

  export const errorResponse = t.Object({
    success: t.Literal(false),
    message: t.String(),
    data: t.Null(),
  });
}
