import React from "react";
import AppWrapperES from "@/components/layout/AppWrapperES";
import SpanishGatekeeper from "@/components/auth/SpanishGatekeeper";

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
