// "use client";
import { Inter } from "next/font/google";
import { useState } from "react";
import { GeistSans } from "geist/font/sans"
import "./../globals.css";
import styles from "./layout.module.css";
import { AuthContextProvider, ThemeProvider, useTheme } from "@/context";
import Navbar from "../components/Navbar";
import { Sora } from "next/font/google";
import Sidebar from "../components/sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Joyride from "react-joyride";
import { Metadata } from "next";

const sora = Sora({
  subsets: ["latin"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Eventgeni",
  description: "All-in-one solution to maximize ROI from your event GTM strategy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [event, setEvent] = useState();
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
            <div className="body_layout">{children}</div>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
          </ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
