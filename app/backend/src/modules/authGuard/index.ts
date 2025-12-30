import Elysia, { status } from "elysia";
import { verifyJWT } from "../../utils/jwt";
import type { AuthGuardModel } from "./model";

export const authGuard = new Elysia()
  .derive<AuthGuardModel.authGuardContext>(({ headers }) => {
    const auth = headers["authorization"];
    if (!auth) throw status(401, "Unauthorized");

    const token = auth.replace("Bearer ", "");

    try {
      const payload = verifyJWT(token);
      return { user: payload as AuthGuardModel.payload };
    } catch (e) {
      throw status(401, e);
    }
  })
  .as("scoped");
