"use client";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-[calc(100vh-84px)]">{children}</div>;
}
