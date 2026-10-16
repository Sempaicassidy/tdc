"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { memo, type ReactNode } from "react";
import type { Member } from "@/data/members";
import { cn } from "@/lib/utils";
import { morphTransition } from "./dialog-shell";
import { MemberAvatar } from "./member-avatar";
import { WhatsAppMark } from "./whatsapp-mark";

type Placement = {
  x: number;
  y: number;
  size: number;
  delay: number;
  lifted?: boolean;
  dimmed?: boolean;
  highlighted?: boolean;
};

function TileFrame({ x, y, size, delay, lifted, dimmed, children }: Omit<Placement, "highlighted"> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        "tile-move absolute left-0 top-0",
        lifted ? "pointer-events-none z-[60]" : "z-10 focus-within:z-20",
        dimmed && "pointer-events-none opacity-[0.16] grayscale",
      )}
      style={{ transform: `translate3d(${x}px, ${y}px, 0)`, width: size, height: size }}
    >
      <div className="tile-in h-full w-full" style={{ animationDelay: `${delay}ms` }}>
        {children}
      </div>
    </div>
  );
}

type MemberTileProps = Placement & {
  id: string;
  member: Member;
  onOpen: (id: string) => void;
  onHover: (id: string | null) => void;
};

function MemberTileBase({ id, member, onOpen, onHover, highlighted, ...placement }: MemberTileProps) {
  const label = [member.name, member.title, member.openToWork ? "open to work" : null]
    .filter(Boolean)
    .join(", ");
  return (
    <TileFrame {...placement}>
      <button
        type="button"
        data-member={id}
        aria-label={label}
        tabIndex={placement.dimmed ? -1 : 0}
        onClick={() => onOpen(id)}
        onPointerEnter={() => onHover(id)}
        onPointerLeave={() => onHover(null)}
        className="group relative block h-full w-full cursor-pointer outline-none"
      >
        <motion.div
          layoutId={`member-${id}`}
          transition={morphTransition}
          style={{ borderRadius: 0 }}
          className="relative h-full w-full overflow-hidden bg-raised"
        >
          <motion.div
            layoutId={`photo-${id}`}
            transition={morphTransition}
            style={{ borderRadius: 0 }}
            className="absolute inset-0 overflow-hidden"
          >
            <MemberAvatar
              member={member}
              initialsClassName="text-[clamp(18px,22%,30px)]"
              className={cn(
                "scale-[1.001] contrast-[1.04] transition-[filter,scale] duration-500 ease-out group-hover:scale-[1.07] group-hover:contrast-[1.06] group-hover:saturate-[1.4] group-focus-visible:saturate-[1.4]",
                highlighted ? "saturate-[1.1]" : "saturate-[0.28]",
              )}
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1.5 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-2.5 pb-2 pt-10 text-left opacity-0 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            <p className="truncate text-[13px] font-semibold leading-tight text-white font-stretch-semi-condensed">
              {member.name}
            </p>
            {member.title && (
              <p className="mt-0.5 truncate text-[11px] leading-tight text-white/75">{member.title}</p>
            )}
          </div>
          {member.openToWork && (
            <span className="absolute right-2 top-2 size-2.5 rounded-full bg-gold shadow-[0_0_0_2px_rgb(0_0_0/0.22)]" />
          )}
          <span className="pointer-events-none absolute inset-0 opacity-0 shadow-[inset_0_0_0_2px_var(--ink)] group-focus-visible:opacity-100" />
        </motion.div>
      </button>
    </TileFrame>
  );
}

export const MemberTile = memo(MemberTileBase);

type ActionTileProps = Placement & {
  kind: "join" | "whatsapp";
  onOpen: () => void;
};

function ActionTileBase({ kind, onOpen, ...placement }: ActionTileProps) {
  const join = kind === "join";
  const compact = placement.size < 128;
  const iconSize = Math.round(placement.size * (compact ? 0.32 : 0.34));
  return (
    <TileFrame {...placement}>
      <button
        type="button"
        aria-label={join ? "Add yourself to the community" : "Join the TDC WhatsApp group"}
        onClick={onOpen}
        className="group relative block h-full w-full cursor-pointer outline-none"
      >
        <motion.div
          layoutId={join ? "tile-join" : "tile-whatsapp"}
          transition={morphTransition}
          style={{ borderRadius: 0 }}
          className={cn(
            "relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-1.5 text-center transition-colors duration-300",
            compact ? "gap-2" : "gap-3",
            join
              ? "bg-surface text-ink group-hover:bg-ink group-hover:text-surface"
              : "bg-whatsapp text-white group-hover:bg-[#1fc15c]",
          )}
        >
          {join ? (
            <Plus
              size={iconSize}
              strokeWidth={1.4}
              className="shrink-0 transition-transform duration-500 ease-out group-hover:rotate-90"
            />
          ) : (
            <WhatsAppMark
              size={iconSize}
              className="transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-105"
            />
          )}
          <span
            className={cn(
              "whitespace-nowrap font-medium leading-none",
              compact ? "text-[11px] tracking-[-0.005em] font-stretch-semi-condensed" : "text-[12.5px]",
              join ? "text-muted group-hover:text-surface/70" : "text-white",
            )}
          >
            {join ? "Add yourself" : "WhatsApp group"}
          </span>
          <span className="pointer-events-none absolute inset-0 opacity-0 shadow-[inset_0_0_0_2px_var(--ink)] group-focus-visible:opacity-100" />
        </motion.div>
      </button>
    </TileFrame>
  );
}

export const ActionTile = memo(ActionTileBase);

export function OpenSpot({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-[5]"
      style={{ transform: `translate3d(${x}px, ${y}px, 0)`, width: size, height: size }}
    >
      <div className="flex h-full w-full animate-[spot-in_160ms_ease-out] flex-col items-center justify-center gap-1.5 bg-surface/80 text-muted">
        <Plus size={18} strokeWidth={1.6} />
        <span className="text-[11px] font-medium">Open spot</span>
      </div>
    </div>
  );
}
