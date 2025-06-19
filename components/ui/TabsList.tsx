"use client";

import { ReactNode } from "react";

export default function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`flex mb-4 gap-2 ${className}`}>{children}</div>;
}