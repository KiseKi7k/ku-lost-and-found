import {treaty} from "@elysiajs/eden"
import type { App } from '@backend/src/index'

const api = treaty<App>(process.env['API_SERVER_URL']!).api.v1