import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./../globals.css";
import { AuthContextProvider, ThemeProvider } from "@/context";
import Navbar from "../components/Navbar";
import { Sora } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GeistSans } from 'geist/font/sans';
import Sidebar from "@/components/layout/sidebar";
import styles from './layout.style.module.css'

const sora = Sora({
  subsets: ["latin"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
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
            <div className="desktop_view tablet_view">
              <Sidebar />
            </div>
            <Navbar />
            <div className={styles.container}>{children}</div>
            {/* <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} /> */}
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
          </ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
