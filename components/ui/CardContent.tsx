import { ReactNode } from "react";

export default function CardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`text-white ${className}`}>{children}</div>;
}