import React from "react";
import AppWrapper from "@/components/layout/AppWrapper";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppWrapper>
      {children}
    </AppWrapper>
  );
}
