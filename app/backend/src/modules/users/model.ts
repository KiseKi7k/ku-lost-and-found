import { t, type TSchema } from "elysia";

export namespace UsersModel {
  export const user = t.Object({
    id: t.String(),
    name: t.Nullable(t.String()),
    email: t.String(),
    image: t.Nullable(t.String()),
    role: t.String(),
  });
  export type user = typeof user.static;

  export const userNotFound = t.Literal("User not found");
  export type userNotFound = typeof userNotFound.static;

  export const apiResponse = <T extends TSchema>(dataSchema: T) =>
    t.Object({
      success: t.Literal(true),
      message: t.Nullable(t.String()),
      data: dataSchema,
    });
}
