import NextAuth, { AuthOptions, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET || "",
    }),
    LinkedInProvider({
      clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.NEXT_LINKEDIN_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
