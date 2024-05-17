"use client";
import { Inter } from "next/font/google";
import "./../globals.css";
import { AuthContextProvider, ThemeProvider } from "@/context";
import Navbar from "../components/Navbar";
import { Sora } from "next/font/google";
import Sidebar from "../components/Sidebar";
import { useTheme } from "@/context";
import MobileSidebar from "../components/MobileSidebar";

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
  const { theme} = useTheme();
  console.log(theme);
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
