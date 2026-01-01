import ApiResponse from "@/utils/apiResponse";
import authService from "@/utils/authService";
import wrapSuccess from "@/utils/wrapSuccess";
import Elysia from "elysia";
import { UsersModel } from "./model";
import { Users } from "./service";


export const users = new Elysia({ prefix: "/users" })
  .use(authService)
  .use(wrapSuccess)
  .get(
    "/me",
    async ({ userId, wrapSuccess }) => {
      const user = await Users.getUser(userId);
      return wrapSuccess(user);
    },
    {
      auth: true,
      response: {
        200: ApiResponse.success(UsersModel.user),
        404: UsersModel.userNotFound,
      },
    }
  )

  .get(
    "/:id",
    async ({ params: { id }, wrapSuccess }) => {
      const user = await Users.getUser(id);
      return wrapSuccess(user);
    },
    {
      response: {
        200: ApiResponse.success(UsersModel.user),
        404: UsersModel.userNotFound,
      },
    }
  );
