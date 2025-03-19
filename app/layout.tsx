import "@/app/globals.css";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import Providers from "./providers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();  
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
