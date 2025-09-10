import { HTMLAttributes } from "react";
import clsx from "clsx";

export default function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={clsx(
        "rounded-2xl shadow-md border border-gray-100 bg-white",
        className
      )}
    />
  );
}