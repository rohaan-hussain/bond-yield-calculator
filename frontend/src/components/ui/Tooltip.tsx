import type { ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  return (
    <span className="relative inline-flex items-center group">
      {children}
      <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-xs font-bold cursor-help">
        ?
      </span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg z-10">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
      </span>
    </span>
  );
}
