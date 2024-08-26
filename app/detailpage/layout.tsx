// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./../globals.css";
import { Sora } from "next/font/google";
import { GeistSans } from 'geist/font/sans';

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
    return (
        <html lang="en" className={`${sora.className} ${inter.variable} ${GeistSans.className}`}>
            <body>
                <div>{children}</div>
            </body>
        </html>
    );
}
