import React from "react";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex-1 relative overflow-y-auto h-screen scroll-smooth">
      {children}
    </main>
  );
}
