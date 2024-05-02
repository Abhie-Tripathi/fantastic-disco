"use client";
import { Inter } from "next/font/google";
import "./../globals.css";
import { AuthContextProvider, ThemeProvider } from "@/context";
import Navbar from "../components/Navbar";
import { Sora } from "next/font/google";
import Sidebar from "../components/Sidebar";
import { useTheme } from "@/context";
import styles from "./layout.module.css";

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
  const { theme } = useTheme();
  console.log(theme);
  return (
    <html lang="en" className={`${sora.className} ${inter.variable}`}>
      <body>
        <AuthContextProvider>
          <ThemeProvider>
            <Sidebar />
            <Navbar />
            <div style={{ marginTop: "80px", marginLeft: "80px" }}>
              {children}
            </div>
          </ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
