import ApiResponse from "@/utils/apiResponse";
import { t } from "elysia";

export namespace UsersModel {
  export const user = t.Object({
    id: t.String(),
    name: t.Nullable(t.String()),
    email: t.String(),
    image: t.Nullable(t.String()),
    role: t.String(),
  });
  export type user = typeof user.static;

  export const userNotFound = ApiResponse.error("User not found")
  export type userNotFound = typeof userNotFound.static
  }


