"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { X } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const morphTransition: Transition = { type: "spring", bounce: 0.14, duration: 0.62 };

export type ZoomOrigin = { x: number; y: number };

type DialogShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  layoutId?: string;
  origin?: ZoomOrigin | null;
  className?: string;
  onExitComplete?: () => void;
  children: ReactNode;
};

function zoomFrom(origin: ZoomOrigin | null | undefined) {
  if (!origin || typeof window === "undefined") return { opacity: 0, scale: 0.92, x: 0, y: 0 };
  return {
    opacity: 0,
    scale: 0.3,
    x: origin.x - window.innerWidth / 2,
    y: origin.y - window.innerHeight / 2,
  };
}

export function DialogShell({
  open,
  onOpenChange,
  layoutId,
  origin,
  className,
  onExitComplete,
  children,
}: DialogShellProps) {
  const zoom = layoutId ? undefined : zoomFrom(origin);
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence onExitComplete={onExitComplete}>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-[var(--overlay)] backdrop-blur-[6px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
              />
            </Dialog.Overlay>
            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
              <Dialog.Content
                asChild
                forceMount
                aria-describedby={undefined}
                onOpenAutoFocus={(event) => {
                  event.preventDefault();
                  contentRef.current?.focus({ preventScroll: true });
                }}
              >
                <motion.div
                  ref={contentRef}
                  layoutId={layoutId}
                  initial={zoom}
                  animate={zoom ? { opacity: 1, scale: 1, x: 0, y: 0 } : undefined}
                  exit={zoom}
                  transition={morphTransition}
                  style={{ borderRadius: 26 }}
                  className={cn(
                    "pointer-events-auto relative flex max-h-full w-full flex-col overflow-hidden bg-surface text-ink shadow-dialog outline-none",
                    className,
                  )}
                >
                  <motion.div
                    className="flex min-h-0 flex-1 flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.16, duration: 0.26 } }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  >
                    {children}
                  </motion.div>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export function DialogClose({ className }: { className?: string }) {
  return (
    <Dialog.Close
      aria-label="Close"
      className={cn(
        "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-ground hover:text-ink focus-visible:outline-2 focus-visible:outline-ink",
        className,
      )}
    >
      <X size={18} strokeWidth={2} />
    </Dialog.Close>
  );
}
