"use client";
import { Inter } from "next/font/google";
import "./../globals.css";
import styles from './layout.module.css';
import { AuthContextProvider, ThemeProvider, useTheme } from "@/context";
import Navbar from "../components/Navbar";
import { Sora } from "next/font/google";
import Sidebar from "../components/Sidebar";

const sora = Sora({
  subsets: ["latin"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if(document.body.style.height==='100vh'){
    document.body.style.height="auto";
  }
  return (
    <html lang="en" className={`${sora.className} ${inter.variable}`}>
      <body>
        <AuthContextProvider>
          <ThemeProvider>
            
                    <div className="desktop_view tablet_view">

              <Sidebar />
              </div>
            
            <Navbar />
            <div className="body_layout">{children}</div>
          </ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
