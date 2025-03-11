import "@/app/globals.css";
import { getSession } from "next-auth/react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
        {/* <Providers session={session}>{children}</Providers> */}
      </body>
    </html>
  );
}
