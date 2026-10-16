"use client";

import { MotionConfig, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import { community } from "@/data/community";
import type { Member } from "@/data/members";
import {
  cellAt,
  cellBox,
  measureGrid,
  planGrid,
  reconcile,
  reservedCells,
  shuffleStep,
  type Assignment,
  type GridMetrics,
  type GridPlan,
} from "@/lib/grid";
import { buildTagPool, githubUrl, matchesFilters, memberId, pickTags, type Tag } from "@/lib/members";
import type { ZoomOrigin } from "./dialog-shell";
import { JoinDialog } from "./join-dialog";
import { MemberDialog } from "./member-dialog";
import { SearchDock } from "./search-dock";
import { ActionTile, MemberTile, OpenSpot } from "./tiles";
import { WhatsAppDialog } from "./whatsapp-dialog";

type Layout = { metrics: GridMetrics; plan: GridPlan; clearance: number };
type Panel = "join" | "whatsapp";

const tagCount = 5;
const shuffleEvery = 2600;

function sameLayout(a: Layout | null, b: Layout) {
  if (!a) return false;
  return (
    a.metrics.width === b.metrics.width &&
    a.metrics.height === b.metrics.height &&
    a.clearance === b.clearance &&
    a.plan.mode === b.plan.mode &&
    a.plan.rows === b.plan.rows &&
    a.plan.candidates.length === b.plan.candidates.length &&
    a.plan.candidates.every((cell, index) => cell === b.plan.candidates[index])
  );
}

function sameAssignment(a: Assignment, b: Assignment) {
  const keys = Object.keys(b);
  return keys.length === Object.keys(a).length && keys.every((key) => a[key] === b[key]);
}

function clearHash() {
  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}

export default function CommunityGrid({ members }: { members: Member[] }) {
  const ids = useMemo(() => members.map(memberId), [members]);
  const byId = useMemo(() => new Map(members.map((member) => [memberId(member), member])), [members]);
  const pool = useMemo(() => buildTagPool(members), [members]);
  const reduceMotion = useReducedMotion();

  const gridRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hoveredRef = useRef<string | null>(null);

  const [layout, setLayout] = useState<Layout | null>(null);
  const [assignment, setAssignment] = useState<Assignment>({});
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<Tag[]>([]);
  const [visibleTags, setVisibleTags] = useState<Tag[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [joinOrigin, setJoinOrigin] = useState<ZoomOrigin | null>(null);
  const [returning, setReturning] = useState<string | null>(null);
  const [hoverCell, setHoverCell] = useState<number | null>(null);

  const relayout = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const metrics = measureGrid(grid.clientWidth, window.innerHeight);
    const dock = dockRef.current?.getBoundingClientRect();
    const avoid = dock
      ? { left: dock.left, top: dock.top, right: dock.right, bottom: dock.bottom }
      : null;
    const plan = planGrid(metrics, ids.length, avoid);
    const clearance = dock ? Math.ceil(window.innerHeight - dock.top + 24) : 160;
    const next = { metrics, plan, clearance };
    setLayout((previous) => (sameLayout(previous, next) ? previous : next));
    setAssignment((previous) => {
      const reconciled = reconcile(previous, ids, plan.candidates);
      return sameAssignment(previous, reconciled) ? previous : reconciled;
    });
    setVisibleTags((previous) => (previous.length > 0 ? previous : pickTags(pool, tagCount)));
  }, [ids, pool]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new ResizeObserver(() => relayout());
    observer.observe(grid);
    if (dockRef.current) observer.observe(dockRef.current);
    window.addEventListener("resize", relayout);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", relayout);
    };
  }, [relayout]);

  const ready = layout !== null;

  useEffect(() => {
    if (!ready) return;
    const openFromHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1)).toLowerCase();
      if (!hash) return;
      if (hash === "rules" || hash === "whatsapp") {
        setPanel("whatsapp");
      } else if (hash === "join") {
        setJoinOrigin(null);
        setPanel("join");
      } else if (ids.includes(hash)) {
        setSelectedId(hash);
      }
    };
    const frame = window.requestAnimationFrame(openFromHash);
    window.addEventListener("hashchange", openFromHash);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", openFromHash);
    };
  }, [ready, ids]);

  const filtering = query.trim().length > 0 || activeTags.length > 0;
  const paused =
    !layout || reduceMotion === true || selectedId !== null || panel !== null || filtering || returning !== null;
  const moves = Math.min(4, Math.max(1, Math.round(ids.length / 14)));

  useEffect(() => {
    if (paused || !layout) return;
    const candidates = layout.plan.candidates;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const frozen = new Set<string>();
      if (hoveredRef.current) frozen.add(hoveredRef.current);
      const active = document.activeElement;
      if (active instanceof HTMLElement && active.dataset.member) frozen.add(active.dataset.member);
      setAssignment((previous) => shuffleStep(previous, candidates, frozen, moves));
    }, shuffleEvery);
    return () => window.clearInterval(timer);
  }, [paused, layout, moves]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target !== null &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      const shortcut =
        (event.key === "/" && !typing) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k");
      if (!shortcut || selectedId || panel) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, panel]);

  const matchIds = useMemo(() => {
    if (!filtering) return null;
    return new Set(members.filter((member) => matchesFilters(member, query, activeTags)).map(memberId));
  }, [filtering, members, query, activeTags]);

  const activeKeys = useMemo(() => new Set(activeTags.map((tag) => tag.key)), [activeTags]);
  const occupied = useMemo(() => new Set(Object.values(assignment)), [assignment]);

  const openMember = useCallback((id: string) => {
    setSelectedId(id);
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  const closeMember = useCallback(() => {
    setReturning(selectedId);
    setSelectedId(null);
    clearHash();
  }, [selectedId]);

  const onHoverMember = useCallback((id: string | null) => {
    hoveredRef.current = id;
  }, []);

  const openJoinFromTile = useCallback(() => {
    setJoinOrigin(null);
    setPanel("join");
  }, []);

  const openWhatsApp = useCallback(() => setPanel("whatsapp"), []);

  const closePanel = useCallback(() => {
    setReturning(panel === "join" && joinOrigin ? null : panel);
    setPanel(null);
    clearHash();
  }, [panel, joinOrigin]);

  const toggleTag = useCallback((tag: Tag) => {
    setActiveTags((previous) =>
      previous.some((item) => item.key === tag.key)
        ? previous.filter((item) => item.key !== tag.key)
        : [...previous, tag],
    );
  }, []);

  const pickFromCard = useCallback(
    (tag: Tag) => {
      closeMember();
      setQuery("");
      setActiveTags([tag]);
      setVisibleTags((previous) =>
        previous.some((item) => item.key === tag.key) ? previous : [tag, ...previous.slice(0, tagCount - 1)],
      );
    },
    [closeMember],
  );

  const shuffleTags = useCallback(() => {
    setVisibleTags(pickTags(pool, tagCount, activeTags));
  }, [pool, activeTags]);

  const clearFilters = useCallback(() => {
    setQuery("");
    setActiveTags([]);
  }, []);

  const gridHeight = layout
    ? layout.plan.mode === "scatter"
      ? layout.metrics.height
      : layout.plan.rows * layout.metrics.size + layout.clearance
    : undefined;

  const cellFromEvent = (event: PointerEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) => {
    const grid = gridRef.current;
    if (!layout || !grid || gridHeight === undefined) return null;
    const rect = grid.getBoundingClientRect();
    const rows = Math.ceil(gridHeight / layout.metrics.size);
    const cell = cellAt(layout.metrics, event.clientX - rect.left, event.clientY - rect.top, rows);
    if (cell === null || cell < reservedCells || occupied.has(cell)) return null;
    return cell;
  };

  const onGridPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    setHoverCell(cellFromEvent(event));
  };

  const onGridClick = (event: MouseEvent<HTMLDivElement>) => {
    const cell = cellFromEvent(event);
    const grid = gridRef.current;
    if (cell === null || !layout || !grid) return;
    const rect = grid.getBoundingClientRect();
    const box = cellBox(layout.metrics, cell);
    const half = layout.metrics.size / 2;
    setJoinOrigin({ x: rect.left + box.left + half, y: rect.top + box.top + half });
    setPanel("join");
    setHoverCell(null);
  };

  const selectedMember = selectedId ? (byId.get(selectedId) ?? null) : null;
  const matchCount = matchIds ? matchIds.size : members.length;

  const tileProps = (cell: number) => {
    const metrics = layout!.metrics;
    const box = cellBox(metrics, cell);
    const col = cell % metrics.cols;
    const row = Math.floor(cell / metrics.cols);
    return {
      x: box.left + 1,
      y: box.top + 1,
      size: metrics.size - 1,
      delay: Math.min(1100, (col + row) * 48),
    };
  };

  return (
    <MotionConfig reducedMotion="user">
      <main
        className="grid-field relative min-h-dvh w-full overflow-x-clip"
        style={
          layout
            ? ({
                "--cell": `${layout.metrics.size}px`,
                "--offset-x": `${layout.metrics.offsetX}px`,
              } as CSSProperties)
            : undefined
        }
      >
        <h1 className="sr-only">{community.name}</h1>
        <div
          ref={gridRef}
          className="relative w-full"
          style={{ height: gridHeight ?? "100dvh" }}
          onPointerMove={onGridPointerMove}
          onPointerLeave={() => setHoverCell(null)}
          onClick={onGridClick}
        >
          {layout ? (
            <>
              <ActionTile
                kind="join"
                onOpen={openJoinFromTile}
                lifted={returning === "join"}
                {...tileProps(0)}
              />
              <ActionTile
                kind="whatsapp"
                onOpen={openWhatsApp}
                lifted={returning === "whatsapp"}
                {...tileProps(1)}
              />
              {members.map((member) => {
                const id = memberId(member);
                const cell = assignment[id];
                if (cell === undefined) return null;
                return (
                  <MemberTile
                    key={id}
                    id={id}
                    member={member}
                    onOpen={openMember}
                    onHover={onHoverMember}
                    dimmed={matchIds ? !matchIds.has(id) : false}
                    highlighted={matchIds ? matchIds.has(id) : false}
                    lifted={returning === id}
                    {...tileProps(cell)}
                  />
                );
              })}
              {hoverCell !== null && !panel && !selectedId && (
                <OpenSpot key={hoverCell} {...tileProps(hoverCell)} />
              )}
            </>
          ) : (
            <ul className="sr-only">
              {members.map((member) => (
                <li key={memberId(member)}>
                  <a href={githubUrl(member)}>{member.name}</a>
                  {member.title ? `, ${member.title}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>

        <SearchDock
          dockRef={dockRef}
          inputRef={inputRef}
          query={query}
          onQueryChange={setQuery}
          tags={visibleTags}
          activeKeys={activeKeys}
          onToggleTag={toggleTag}
          onShuffleTags={shuffleTags}
          onClear={clearFilters}
          onSubmit={() => {
            if (matchIds && matchIds.size === 1) openMember([...matchIds][0]);
          }}
          matchCount={matchCount}
          total={members.length}
        />

        <MemberDialog
          member={selectedMember}
          onClose={closeMember}
          onPickTag={pickFromCard}
          onExitComplete={() => setReturning(null)}
        />
        <JoinDialog
          open={panel === "join"}
          origin={joinOrigin}
          onClose={closePanel}
          onExitComplete={() => setReturning(null)}
        />
        <WhatsAppDialog
          open={panel === "whatsapp"}
          onClose={closePanel}
          onExitComplete={() => setReturning(null)}
        />
      </main>
    </MotionConfig>
  );
}
