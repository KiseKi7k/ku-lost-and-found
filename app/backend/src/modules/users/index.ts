import { Elysia, status } from "elysia";
import { UsersModel } from "./model.js";
import { User } from "./service.js";
import { authService } from "../authService/index.js";

export const users = new Elysia({ prefix: "/users" })
  .use(authService)

  .get(
    "/me",
    async ({ userId }) => {
      const userData = await User.getUser(userId);
      return userData;
    },
    {
      auth: true,
      response: {
        200: UsersModel.user,
        404: UsersModel.userNotFound,
      },
    }
  )

  .get(
    "/:id",
    async ({ params: { id } }) => {
      const user = await User.getUser(id);
      return user;
    },
    {
      response: {
        200: UsersModel.user,
        404: UsersModel.userNotFound,
      },
    }
  );
