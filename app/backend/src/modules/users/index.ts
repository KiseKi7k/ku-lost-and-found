import { Elysia, status } from "elysia";
import { UsersModel } from "./model.js";
import { User } from "./service.js";
import { authGuard } from "../authGuard/index.js";

export const users = new Elysia({ prefix: "/users" })
  .use(authGuard)
  .onBeforeHandle(({ user }) => {
    if (!user) throw status(401, "Unauthorized");
  })

  .get(
    "/me",
    async ({ user }) => {
      const userData = await User.getUser(user.userId);
      return userData;
    },
    {
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
