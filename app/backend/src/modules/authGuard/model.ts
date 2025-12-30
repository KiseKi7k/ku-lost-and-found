import { t } from "elysia";

export namespace AuthGuardModel {
  export const payload = t.Object({
    userId: t.String(),
  });
  export type payload = typeof payload.static;

  export const authGuardContext = t.Object({
    user: payload
  })
  export type authGuardContext = typeof authGuardContext.static
}
