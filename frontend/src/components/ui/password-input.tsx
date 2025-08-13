"use client";
import { InputHTMLAttributes, useState } from "react";
import clsx from "clsx";

export default function PasswordInput(
  props: InputHTMLAttributes<HTMLInputElement>
) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        {...props}
        type={show ? "text" : "password"}
        className={clsx(
          "w-full rounded-xl border border-gray-300 px-3 py-2 pr-10",
          "focus:outline-none focus:ring-2 focus:ring-gray-900/20",
          props.className
        )}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute inset-y-0 right-2 my-auto text-gray-500 text-xs"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
