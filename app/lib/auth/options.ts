import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify" } },
    }),
    // Сюда в будущем добавите GoogleProvider, GitHubProvider и т.д.
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // Добавляем ID пользователя Discord в сессию, чтобы делать на него ссылку
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
