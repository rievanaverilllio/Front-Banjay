export type Matcher = (pathname: string) => boolean

export function pathStartsWith(prefix: string): Matcher {
  return (pathname: string) => pathname.startsWith(prefix)
}

export function pathIncludes(segment: string): Matcher {
  return (pathname: string) => pathname.includes(segment)
}

export function any(...matchers: Matcher[]): Matcher {
  return (pathname: string) => matchers.some((m) => m(pathname))
}

export function all(...matchers: Matcher[]): Matcher {
  return (pathname: string) => matchers.every((m) => m(pathname))
}
