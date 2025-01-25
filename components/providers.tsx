"use client";

import { SessionProvider, SessionProviderProps } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

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
        <NuqsAdapter>
          <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
        </NuqsAdapter>
      </ThemeProvider>
    </SessionProvider>
  );
}
