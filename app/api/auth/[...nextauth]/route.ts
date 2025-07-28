import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { getDb } from "@/lib/db";
import type { NextAuthOptions } from "next-auth";

// 扩展User类型以包含username属性
declare module "next-auth" {
  interface User {
    username?: string;
    id: string;
  }
  
  interface Session {
    user: {
      id: string;
      username?: string;
      name?: string;
      email?: string;
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const db = await getDb();
          const [rows] = await db.query(
            "SELECT * FROM users WHERE username = ? AND is_active = 1 LIMIT 1",
            [credentials.username]
          );
          
          const users = rows as any[];
          const user = users[0];

          if (!user) {
            return null;
          }

          const isValid = await compare(credentials.password, user.password);
          
          if (!isValid) {
            return null;
          }

          return {
            id: user.id.toString(),
            name: user.nickname || user.username,
            email: user.email,
            username: user.username,
          };
        } catch (error) {
          console.error("认证过程发生错误:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  secret: process.env.NEXTAUTH_SECRET || "your-default-secret-should-be-changed",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 