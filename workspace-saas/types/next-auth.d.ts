import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    color?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      color?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    color?: string;
  }
}
