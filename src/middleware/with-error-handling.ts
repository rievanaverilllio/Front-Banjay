export type Handler = (req: Request) => Promise<Response> | Response

export function withErrorHandling(handler: Handler): Handler {
  return async (req: Request) => {
    try {
      return await handler(req)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      return new Response(
        JSON.stringify({ error: message }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        },
      )
    }
  }
}
