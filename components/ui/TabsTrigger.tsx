"use client";

import { ReactNode } from "react";

export default function TabsTrigger({ value, setActive, active, children }: { value: string; setActive: (v: string) => void; active: string; children: ReactNode }) {
  return (
    <button
      onClick={() => setActive(value)}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
        value === active ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {children}
    </button>
  );
}