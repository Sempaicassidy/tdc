import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<main className="grid-field grid min-h-dvh place-items-center px-4 [--cell:128px]">
			<div className="w-full max-w-[420px] rounded-[26px] bg-surface p-7 text-ink shadow-dialog">
				<span className="grid size-14 place-items-center rounded-2xl border border-dashed border-line-strong text-muted">
					<Plus size={22} strokeWidth={1.6} />
				</span>
				<h1 className="mt-6 text-[30px] font-bold leading-[1.05] tracking-[-0.015em] font-stretch-expanded">
					This spot is empty
				</h1>
				<p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">
					The page you asked for does not exist or has moved. Everyone is on the
					main grid.
				</p>
				<Link
					href="/"
					className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-ink pl-3.5 pr-4 text-[14px] font-semibold text-surface transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
				>
					<ArrowLeft size={16} />
					Back to the community
				</Link>
			</div>
		</main>
	);
}
