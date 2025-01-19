"use client";

import { SessionProvider, SessionProviderProps } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import { TooltipProvider } from "./ui/tooltip";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: SessionProviderProps["session"];
}) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
