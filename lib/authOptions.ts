import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "@/env";
import { prisma } from "@/lib/database";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      authorization:
        "https://discord.com/api/oauth2/authorize?scope=identify+email+guilds",
      token: "https://discord.com/api/oauth2/token",
      userinfo: "https://discord.com/api/users/@me",
      profile(profile) {
        if (profile.avatar === null) {
          const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
          const format = profile.avatar.startsWith("a_") ? "gif" : "png";
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }

        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.image_url,
          discordId: profile.id,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.id = profile.id;
        token.global_name = profile.global_name;
        token.locale = profile.locale;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.global_name = token.global_name as string;
        session.user.locale = token.locale as string;
      }
      return session;
    },
  },

  secret: env.NEXTAUTH_SECRET,
};
