import { cookies } from "next/headers";
import Navbar from "@/components/layout/navbar";
import { AuthContextProvider, ThemeProvider } from "@/context";
import PublicNavBar from "@/components/layout/publicNavBar";
import { Toaster } from "@/components/ui/toaster";
import "./../globals.css";
import Sidebar from "@/components/layout/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const userToken = cookieStore.get(
    process.env.NEXT_COOKIE_PREFIX
      ? `${process.env.NEXT_COOKIE_PREFIX}-token`
      : "dev-token"
  );

  return (
    <AuthContextProvider>
      <ThemeProvider>
      <html lang="en">
        <body className="flex h-screen bg-gray-100">
          {userToken ? (
            <div className="flex h-screen bg-gray-100 w-full">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden lg:ml-16">
                <Navbar />
                <main
                  id="layout-main"
                  className="flex-1 overflow-x-hidden !overflow-y-auto bg-background"
                >
                  <Toaster />
                  {children}
                </main>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden w-full h-[100vh]">
              <PublicNavBar isPublic={!userToken?true:false}/>
              <main className="flex-1 overflow-x-hidden !overflow-y-auto bg-background">
                <Toaster />
                {children}
              </main>
            </div>
          )}
        </body>
      </html>
      </ThemeProvider>
    </AuthContextProvider>
  );
}
