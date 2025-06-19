// components/ui/tabs.tsx

"use client";
import { ReactNode, useState, createContext, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TabsContext = createContext<any>(null);

export function Tabs({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children }: { children: ReactNode }) {
  return <div className="flex gap-2 mb-4">{children}</div>;
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const { active, setActive } = useContext(TabsContext);

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

export function TabsContent({ value, children }: { value: string; children: ReactNode }) {
  const { active } = useContext(TabsContext);
  return active === value ? <div className="mt-4">{children}</div> : null;
}
