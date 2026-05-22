import type { ReactNode } from "react";

type Props = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ title, onClose, children }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-6 flex flex-col gap-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xl leading-none transition-colors"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
