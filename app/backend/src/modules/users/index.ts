import { Elysia } from "elysia";
import { UsersModel } from "./model.js";
import { Users } from "./service.js";
import { authService } from "../authService/index.js";

export const users = new Elysia({ prefix: "/users" })
  .use(authService)

  .get(
    "/me",
    async ({ userId }) => {
      const user = await Users.getUser(userId);
      return {
        success: true,
        data: user,
        message: "",
      };
    },
    {
      auth: true,
      response: {
        200: UsersModel.apiResponse(UsersModel.user),
        404: UsersModel.userNotFound,
      },
    }
  )

  .get(
    "/:id",
    async ({ params: { id } }) => {
      const user = await Users.getUser(id);
      return {
        success: true,
        data: user,
        message: "",
      };
    },
    {
      response: {
        200: UsersModel.apiResponse(UsersModel.user),
        404: UsersModel.userNotFound,
      },
    }
  );
