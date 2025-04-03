//@ts-nocheck
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    LinkedInProvider({
      clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.NEXT_LINKEDIN_CLIENT_SECRET || "",
      client: { token_endpoint_auth_method: "client_secret_post" },
      issuer: "https://www.linkedin.com",
      profile: (profile) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }),
      wellKnown:
        "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (account && account.provider === "google") {
        return true;
      } else if (account && account.provider === "linkedin") {
        return true;
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && account.provider === "google") {
        token.accessToken = account.access_token;
        token.name = profile?.name || token.name;
        token.email = profile?.email || token.email;
        token.provider = account.provider || "";
      }
      if (account && account.provider === "linkedin") {
        token.accessToken = account.access_token;
        token.name = profile?.name || token.name;
        token.email = profile?.email || token.email;
        token.provider = account.provider || "";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          name: token.name,
          email: token.email,
          accessToken: token.accessToken,
          provider: token.provider,
        };
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
