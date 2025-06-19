"use client";

import { ReactNode } from "react";

export default function TabsContent({ value, active, children }: { value: string; active: string; children: ReactNode }) {
  return active === value ? <div className="mt-4">{children}</div> : null;
}
