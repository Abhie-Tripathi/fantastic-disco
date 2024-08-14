import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./../globals.css";
import { AuthContextProvider, ThemeProvider } from "@/context";
import Navbar from "../components/Navbar";
import { Sora } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GeistSans } from 'geist/font/sans';

const sora = Sora({
  subsets: ["latin"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
export const metadata: Metadata = {
  title: "Eventgeni",
  description: "Connecting Opportunities, Discover Events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.className} ${inter.variable} ${GeistSans.className}`}>
      <body>
      <ToastContainer />
        <AuthContextProvider>
          <ThemeProvider>
            <Navbar />
            <div style={{ paddingTop: "70px" }}>{children}</div>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
          </ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
