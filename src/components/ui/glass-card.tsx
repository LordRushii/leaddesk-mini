import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  glowEffect?: boolean;
  className?: string;
}

export function GlassCard({
  children,
  hoverEffect = false,
  glowEffect = false,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 transition-all duration-300 shadow-2xl",
        hoverEffect && "hover:border-indigo-500/30 hover:bg-slate-900/70 hover:shadow-indigo-500/10",
        glowEffect && "before:absolute before:-inset-px before:rounded-2xl before:bg-gradient-to-r before:from-indigo-500/20 before:to-violet-500/20 before:-z-10 before:blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
