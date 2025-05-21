// "use client";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import ReactQueryProvider from "@/components/provider/reactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { AuthContextProvider, ThemeProvider } from "@/context";
import { FilterProvider } from "@/context/filterContext";
import { GoogleTagManager } from "@next/third-parties/google";
import { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./../globals.css";

const sora = Sora({
  subsets: ["latin"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Whr.ai",
  description:
    "All-in-one solution to maximize ROI from your event GTM strategy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
      <ReactQueryProvider>
        <AuthContextProvider>
          <FilterProvider>
            <ThemeProvider>
              <div className="flex h-screen bg-gray-100">
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
              {/* <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} /> */}
            </ThemeProvider>
          </FilterProvider>
        </AuthContextProvider>
      </ReactQueryProvider>
    </>
  );
}
