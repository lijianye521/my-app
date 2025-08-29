import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getDb } from "@/lib/db";
import type { NextAuthOptions } from "next-auth";

// 扩展User类型以包含username和role属性
declare module "next-auth" {
  interface User {
    username?: string;
    id: string;
    role?: string;
  }
  
  interface Session {
    user: {
      id: string;
      username?: string;
      name?: string;
      email?: string;
      role?: string;
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
          // 确保明确指定所有需要的字段，包括role
          const [rows] = await db.query(
            "SELECT id, username, password, nickname, email, role, is_active FROM users WHERE username = ? AND is_active = 1 LIMIT 1",
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

          console.log('用户数据:', {
            id: user.id.toString(),
            name: user.nickname || user.username,
            email: user.email,
            username: user.username,
            role: user.role
          });
          
          return {
            id: user.id.toString(),
            name: user.nickname || user.username,
            email: user.email,
            username: user.username,
            role: user.role,
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
        token.role = user.role;
        console.log('JWT token更新:', { id: token.id, username: token.username, role: token.role });
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
        console.log('Session更新:', { id: session.user.id, username: session.user.username, role: session.user.role });
      }
      return session;
    }
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 7 * 24 * 60 * 60, // 7天
  },
  secret: process.env.NEXTAUTH_SECRET || "your-default-secret-should-be-changed",
}; 