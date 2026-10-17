export const reservedCells = 2;

export type GridMetrics = {
	width: number;
	height: number;
	cols: number;
	size: number;
	offsetX: number;
	viewRows: number;
	fullRows: number;
};

export type Box = { left: number; top: number; right: number; bottom: number };

export type GridPlan = {
	mode: "scatter" | "pack";
	rows: number;
	candidates: number[];
};

export type Assignment = Record<string, number>;

function targetSize(width: number) {
	if (width < 480) return 92;
	if (width < 768) return 112;
	if (width < 1280) return 136;
	if (width < 1800) return 150;
	return 168;
}

export function measureGrid(width: number, height: number): GridMetrics {
	const cols = Math.max(3, Math.round(width / targetSize(width)));
	const size = Math.floor(width / cols);
	return {
		width,
		height,
		cols,
		size,
		offsetX: Math.floor((width - size * cols) / 2),
		viewRows: Math.ceil(height / size),
		fullRows: Math.max(1, Math.floor(height / size)),
	};
}

export function cellBox(metrics: GridMetrics, cell: number): Box {
	const col = cell % metrics.cols;
	const row = Math.floor(cell / metrics.cols);
	const left = metrics.offsetX + col * metrics.size;
	const top = row * metrics.size;
	return { left, top, right: left + metrics.size, bottom: top + metrics.size };
}

function overlaps(a: Box, b: Box, pad: number) {
	return (
		a.left < b.right + pad &&
		a.right > b.left - pad &&
		a.top < b.bottom + pad &&
		a.bottom > b.top - pad
	);
}

export function planGrid(
	metrics: GridMetrics,
	count: number,
	avoid: Box | null,
): GridPlan {
	const visibleCells = metrics.fullRows * metrics.cols;
	const candidates: number[] = [];
	for (let cell = reservedCells; cell < visibleCells; cell++) {
		if (avoid && overlaps(cellBox(metrics, cell), avoid, 8)) continue;
		candidates.push(cell);
	}
	if (candidates.length >= count) {
		return { mode: "scatter", rows: metrics.viewRows, candidates };
	}
	const packed = Array.from(
		{ length: count },
		(_, index) => index + reservedCells,
	);
	return {
		mode: "pack",
		rows: Math.ceil((count + reservedCells) / metrics.cols),
		candidates: packed,
	};
}

export function shuffled<T>(items: T[]) {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export function reconcile(
	previous: Assignment,
	ids: string[],
	candidates: number[],
) {
	const allowed = new Set(candidates);
	const next: Assignment = {};
	const used = new Set<number>();
	const homeless: string[] = [];
	for (const id of ids) {
		const cell = previous[id];
		if (cell !== undefined && allowed.has(cell) && !used.has(cell)) {
			next[id] = cell;
			used.add(cell);
		} else {
			homeless.push(id);
		}
	}
	const free = shuffled(candidates.filter((cell) => !used.has(cell)));
	for (const id of shuffled(homeless)) {
		const cell = free.pop();
		if (cell !== undefined) next[id] = cell;
	}
	return next;
}

export function shuffleStep(
	assignment: Assignment,
	candidates: number[],
	frozen: Set<string>,
	moves: number,
) {
	const next: Assignment = { ...assignment };
	const movable = shuffled(Object.keys(next).filter((id) => !frozen.has(id)));
	const occupied = new Set(Object.values(next));
	const free = candidates.filter((cell) => !occupied.has(cell));
	for (let step = 0; step < moves && movable.length > 0; step++) {
		const a = movable.pop()!;
		if (free.length > 0 && (movable.length === 0 || Math.random() < 0.55)) {
			const index = Math.floor(Math.random() * free.length);
			const target = free[index];
			free[index] = next[a];
			next[a] = target;
			continue;
		}
		const b = movable.pop();
		if (!b) break;
		[next[a], next[b]] = [next[b], next[a]];
	}
	return next;
}
