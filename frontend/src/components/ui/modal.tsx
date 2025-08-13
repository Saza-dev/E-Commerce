"use client";
import { useEffect } from "react";
import clsx from "clsx";

export default function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={clsx(
          "absolute left-1/2 top-10 -translate-x-1/2",
          size === "sm" && "w-[28rem] max-w-[90vw]",
          size === "md" && "w-[36rem] max-w-[92vw]",
          size === "lg" && "w-[48rem] max-w-[95vw]"
        )}
      >
        <div className="rounded-2xl border border-gray-200 bg-white shadow-lg">
          {title && (
            <div className="px-5 py-4 border-b">
              <h3 className="font-semibold">{title}</h3>
            </div>
          )}
          <div className="p-5">{children}</div>
          {footer && (
            <div className="px-5 py-4 border-t flex justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
