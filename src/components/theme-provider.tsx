"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

interface ThemeProviderProps extends React.ComponentProps<
  typeof NextThemesProvider
> {}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
