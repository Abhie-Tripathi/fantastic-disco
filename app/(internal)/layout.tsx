// "use client";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./../globals.css";
import { AuthContextProvider, ThemeProvider, useTheme } from "@/context";
import { Sora } from "next/font/google";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleTagManager } from "@next/third-parties/google";
import Joyride from "react-joyride";
import { Metadata } from "next";
import { FilterProvider } from "@/context/filterContext";
import ReactQueryProvider from "@/components/provider/reactQueryProvider";

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
  // const [event, setEvent] = useState();
  return (
    <html lang="en" className={`${GeistSans.className}`}>
      <body>
        <ToastContainer />
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
        <ReactQueryProvider>
          <AuthContextProvider>
            <FilterProvider>
              <ThemeProvider>
                <div className="flex bg-gray-100">
                  <Sidebar />
                  <div className="flex-1 flex flex-col overflow-hidden lg:ml-16">
                    <Navbar />
                    <main className="flex-1 overflow-x-hidden !overflow-y-auto bg-background">
                      {children}
                    </main>
                  </div>
                </div>
                {/* <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} /> */}
              </ThemeProvider>
            </FilterProvider>
          </AuthContextProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
