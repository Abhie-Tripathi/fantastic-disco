import "@/app/globals.css";
import { TransitionProvider } from "@/context/transition";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="min-h-screen">
        <TransitionProvider>
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}
