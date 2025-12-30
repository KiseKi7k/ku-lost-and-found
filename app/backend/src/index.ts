import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { users } from "./modules/users";
import openapi from "@elysiajs/openapi";
import { records } from "./modules/records";

const app = new Elysia({ adapter: node() })
  .use(openapi())
  .group("/api", (api) => {
    api.use(users);
    api.use(records);
    return api;
  })

  .get("/", () => "Hello Elysia")

  .listen(8000, ({ hostname, port }) => {
    console.log(`🦊 Elysia is running at ${hostname}:${port}`);
  });
