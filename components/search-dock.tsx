"use client";

import { Search, Shuffle, X } from "lucide-react";
import type { Ref, RefObject } from "react";
import type { Tag } from "@/lib/members";
import { cn } from "@/lib/utils";

type SearchDockProps = {
  dockRef: Ref<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  onQueryChange: (query: string) => void;
  tags: Tag[];
  activeKeys: Set<string>;
  onToggleTag: (tag: Tag) => void;
  onShuffleTags: () => void;
  onClear: () => void;
  onSubmit: () => void;
  matchCount: number;
  total: number;
};

export function SearchDock({
  dockRef,
  inputRef,
  query,
  onQueryChange,
  tags,
  activeKeys,
  onToggleTag,
  onShuffleTags,
  onClear,
  onSubmit,
  matchCount,
  total,
}: SearchDockProps) {
  const filtering = query.trim().length > 0 || activeKeys.size > 0;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-6">
      <div ref={dockRef} className="pointer-events-auto flex w-full max-w-[560px] flex-col gap-2.5">
        <div
          role="search"
          className="flex h-14 items-center gap-3 rounded-full border border-line bg-surface/90 pl-5 pr-2 shadow-float backdrop-blur-xl transition-colors focus-within:border-line-strong"
        >
          <Search size={18} strokeWidth={2} className="shrink-0 text-muted" />
          <div className="relative h-full min-w-0 flex-1">
            {query.length === 0 && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center truncate text-[15px] text-muted"
              >
                <span className="truncate">
                  Search <span className="hidden sm:inline">{total} developers </span>by name, skill or city
                </span>
              </span>
            )}
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onSubmit();
                if (event.key !== "Escape") return;
                if (query) onQueryChange("");
                else event.currentTarget.blur();
              }}
              aria-label={`Search ${total} developers by name, skill or city`}
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="search"
              className="relative h-full w-full bg-transparent text-[15px] text-ink outline-none [&::-webkit-search-cancel-button]:appearance-none"
            />
          </div>
          {filtering ? (
            <>
              <span aria-live="polite" className="shrink-0 whitespace-nowrap text-[13px] tabular-nums text-muted">
                {matchCount === 0 ? "No matches" : `${matchCount} of ${total}`}
              </span>
              <button
                type="button"
                onClick={onClear}
                aria-label="Clear search and tags"
                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-ground hover:text-ink focus-visible:outline-2 focus-visible:outline-ink"
              >
                <X size={17} />
              </button>
            </>
          ) : (
            <kbd className="mr-2 hidden h-7 min-w-7 shrink-0 place-items-center rounded-lg border border-line px-2 font-sans text-[12px] text-muted sm:grid">
              /
            </kbd>
          )}
        </div>

        <div className="no-scrollbar -mx-4 h-8 overflow-x-auto px-4">
          <div className="mx-auto flex w-max items-center gap-1.5">
            {tags.map((tag) => {
              const active = activeKeys.has(tag.key);
              return (
                <button
                  key={tag.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onToggleTag(tag)}
                  className={cn(
                    "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium backdrop-blur-xl transition-colors focus-visible:outline-2 focus-visible:outline-ink",
                    active
                      ? "border-ink bg-ink text-surface"
                      : "border-line bg-surface/90 text-ink-soft hover:border-line-strong hover:text-ink",
                  )}
                >
                  {tag.kind === "open" && <span className="size-2 rounded-full bg-gold" />}
                  {tag.label}
                  {active && <X size={13} className="-mr-1 opacity-70" />}
                </button>
              );
            })}
            {tags.length > 0 && (
              <button
                type="button"
                onClick={onShuffleTags}
                aria-label="Show different tags"
                title="Show different tags"
                className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border border-line bg-surface/90 text-muted backdrop-blur-xl transition-colors hover:border-line-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-ink"
              >
                <Shuffle size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
