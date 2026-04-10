import React from "react";
import type { Metadata } from "next";
import AppWrapperES from "@/components/layout/AppWrapperES";
import SpanishGatekeeper from "@/components/auth/SpanishGatekeeper";

export const metadata: Metadata = {
  title: "ETR - Espanhol Tech",
  description: "Acelere seu Aprendizado",
};

export default function EspanholLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SpanishGatekeeper>
      <AppWrapperES>
        {children}
      </AppWrapperES>
    </SpanishGatekeeper>
  );
}
