import "@/app/globals.css";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          }
        >
          {children}
        </Suspense>
      </body>
    </html>
  );
}
