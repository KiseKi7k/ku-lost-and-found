import Elysia from "elysia";

const wrapSuccess = new Elysia().derive(() => {
    return {
        wrapSuccess: <T>(data: T, message = "") => ({
            success: true as const,
            data,
            message,
        })
    }
}).as('scoped')

export default wrapSuccess;