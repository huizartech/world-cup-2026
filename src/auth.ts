import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.provider !== "google") return false;
      if (!user.email) return false;

      try {
        const existing = await db
          .select()
          .from(users)
          .where(eq(users.googleId, account.providerAccountId))
          .limit(1);

        const isAdmin = user.email === process.env.ADMIN_EMAIL;

        if (existing.length === 0) {
          await db.insert(users).values({
            googleId: account.providerAccountId,
            email: user.email,
            name: user.name ?? null,
            image: user.image ?? null,
            role: isAdmin ? "admin" : "user",
          });
        } else {
          await db
            .update(users)
            .set({
              email: user.email,
              name: user.name ?? null,
              image: user.image ?? null,
              role: isAdmin ? "admin" : existing[0].role,
              updatedAt: new Date(),
            })
            .where(eq(users.googleId, account.providerAccountId));
        }
      } catch {
        // No database connected — allow sign-in without persisting
      }

      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        try {
          const dbUser = await db
            .select()
            .from(users)
            .where(eq(users.email, token.email!))
            .limit(1);

          if (dbUser.length > 0) {
            token.dbId = dbUser[0].id;
            token.role = dbUser[0].role;
            token.phone = dbUser[0].phone;
          }
        } catch {
          // No database — set role from env match
          token.role = token.email === process.env.ADMIN_EMAIL ? "admin" : "user";
        }
      } else if (!token.dbId) {
        // Subsequent requests: look up dbId if not yet set
        try {
          const dbUser = await db
            .select()
            .from(users)
            .where(eq(users.email, token.email!))
            .limit(1);

          if (dbUser.length > 0) {
            token.dbId = dbUser[0].id;
            token.role = dbUser[0].role;
            token.phone = dbUser[0].phone;
          }
        } catch {
          // No database available
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: number }).id = token.dbId as number;
        (session.user as { role: string }).role = token.role as string;
        (session.user as { phone: string | null }).phone = (token.phone as string | null) ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
