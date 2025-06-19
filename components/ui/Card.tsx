
import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return <div className="bg-gray-900 rounded-2xl shadow-md p-4">{children}</div>;
}