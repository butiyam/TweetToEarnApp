import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export default function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition",
        className
      )}
      {...props}
    />
  );
}
