import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { users } from "./modules/users";
import openapi from "@elysiajs/openapi";

const app = new Elysia({ adapter: node() })
  .use(openapi())
  .group("/api", (api) => {
    api.use(users);

    return api;
  })

  .get("/", () => "Hello Elysia")

  .listen(8000, ({ hostname, port }) => {
    console.log(`🦊 Elysia is running at ${hostname}:${port}`);
  });
