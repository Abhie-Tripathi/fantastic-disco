import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import ReactQueryProvider from "@/components/provider/reactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/context";
import { FilterProvider } from "@/context/filterContext";
import { GoogleTagManager } from "@next/third-parties/google";
import { Metadata } from "next";
import PublicNavBar from "@/components/layout/publicNavBar";
import { Inter, Sora } from "next/font/google";
import TrackerGlobalModal from "../components/internal/trackers/TrackerGlobalModal";
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
            <ThemeProvider>
                <FilterProvider>
                <div className="flex h-screen bg-gray-100">
                  {/* <Sidebar /> */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                   <PublicNavBar />
                    <main
                      id="layout-main"
                      className="flex-1 overflow-x-hidden !overflow-y-auto bg-background"
                    >
                      {/* <TrackerGlobalModal /> */}
                      <Toaster />
                      {children}
                    </main>
                  </div>
                </div>
                </FilterProvider>
            </ThemeProvider>
    </>
  );
}
