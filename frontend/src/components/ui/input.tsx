import React, { InputHTMLAttributes, LabelHTMLAttributes } from "react";
import clsx from "clsx";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-xl border border-gray-300 px-3 py-2",
        "focus:outline-none focus:ring-2 focus:ring-gray-900/20",
        props.className
      )}
    />
  );
}

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children?: React.ReactNode;
};

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      {...props}
      className={clsx("mb-1 text-sm font-medium text-gray-700", className)}
    >
      {children}
    </label>
  );
}
