import React from "react";
import AppWrapper from "@/components/layout/AppWrapper";
import GuestGuard from "@/components/auth/GuestGuard";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GuestGuard>
      <AppWrapper>
        {children}
      </AppWrapper>
    </GuestGuard>
  );
}
