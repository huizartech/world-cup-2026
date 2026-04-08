import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    dbId?: number;
    role?: string;
  }
}
