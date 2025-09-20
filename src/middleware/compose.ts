export type NextHandler = (req: Request) => Promise<Response | null> | Response | null

export function compose(...handlers: NextHandler[]) {
  return async (req: Request) => {
    for (const handler of handlers) {
      const res = await handler(req)
      if (res) return res
    }
    return null
  }
}
