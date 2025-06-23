
import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return <div className="bg-[#00000000] rounded-2xl shadow-md p-4">{children}</div>;
}