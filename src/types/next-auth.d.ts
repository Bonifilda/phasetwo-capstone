import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    bio?: string | null
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      bio?: string | null
    }
  }
}