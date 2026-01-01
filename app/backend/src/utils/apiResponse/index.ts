import { t, type TSchema } from "elysia";

namespace ApiResponse {
  export const success = <T extends TSchema>(dataSchema: T) =>
    t.Object({
      success: t.Literal(true),
      message: t.String(),
      data: dataSchema,
    });

  export type success<T extends TSchema> = ReturnType<
    typeof success<T>
  >["static"];

  export const error = <T extends string>(message: T) =>
    t.Object({
      success: t.Literal(false),
      message: t.Literal(message),
      data: t.Null(),
    });

}

export default ApiResponse