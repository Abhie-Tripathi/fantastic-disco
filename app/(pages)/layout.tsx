import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./../globals.css";
import { AuthContextProvider, ThemeProvider } from "@/context";
// import Navbar from "../components/Navbar";
import Navbar from "@/components/layout/navbar";
// import { Sora } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GeistSans } from 'geist/font/sans';
import Sidebar from "@/components/layout/sidebar";
import styles from './layout.style.module.css'

// const sora = Sora({
//   subsets: ["latin"],
// });
// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
// });
export const metadata: Metadata = {
  title: "Whr.ai",
  description: "Connecting Opportunities, Discover Events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.className}`}>
      <body>
        <ToastContainer />
        <AuthContextProvider>
          <ThemeProvider>
            <div className="flex h-screen bg-gray-100">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden ml-16">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
                  {children}
                </main>
              </div>
            </div>
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
          </ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
