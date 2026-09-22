import type { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  text: string;
}

export default function Tooltip({ children, text }: TooltipProps) {
  return (
    <div className="relative group inline-block">
      {children}

      <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2
        whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white
        opacity-0 pointer-events-none transition-opacity
        group-hover:opacity-100">
        {text}
      </div>
    </div>
  );
}