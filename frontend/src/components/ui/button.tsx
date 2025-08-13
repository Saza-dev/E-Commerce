"use client";
import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export default function Button({
  className,
  variant = "primary",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border transition",
        variant === "primary" &&
          "bg-gray-900 text-white border-gray-900 hover:bg-gray-800",
        variant === "ghost" && "border-gray-200 hover:bg-gray-50",
        className
      )}
    />
  );
}
