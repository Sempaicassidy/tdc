"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight } from "lucide-react";
import { community } from "@/data/community";
import { rules } from "@/data/rules";
import { DialogClose, DialogShell } from "./dialog-shell";
import { WhatsAppMark } from "./whatsapp-mark";

type WhatsAppDialogProps = {
	open: boolean;
	onClose: () => void;
	onExitComplete: () => void;
};

export function WhatsAppDialog({
	open,
	onClose,
	onExitComplete,
}: WhatsAppDialogProps) {
	return (
		<DialogShell
			open={open}
			onOpenChange={(next) => {
				if (!next) onClose();
			}}
			layoutId="tile-whatsapp"
			onExitComplete={onExitComplete}
			className="max-w-[580px]"
		>
			<div className="flex items-start gap-4 p-5 pb-5 sm:p-7 sm:pb-6">
				<span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-whatsapp text-white sm:size-14">
					<WhatsAppMark size={26} />
				</span>
				<div className="min-w-0 flex-1 pt-0.5">
					<Dialog.Title className="text-[24px] font-bold leading-[1.05] tracking-[-0.015em] text-ink font-stretch-expanded sm:text-[28px]">
						Join {community.shortName} on WhatsApp
					</Dialog.Title>
					<p className="mt-2.5 max-w-[52ch] text-[15px] leading-[1.6] text-ink-soft">
						Members share their work, ask for help and post opportunities in the
						group. Joining means you agree to these rules.
					</p>
				</div>
				<DialogClose className="-mr-2 -mt-1 sm:-mr-3" />
			</div>

			<ul className="min-h-0 flex-1 divide-y divide-line overflow-y-auto overscroll-contain border-y border-line px-5 sm:px-7">
				{rules.map(({ icon: Icon, title, description }) => (
					<li key={title} className="flex gap-3.5 py-3.5">
						<Icon
							size={18}
							strokeWidth={1.8}
							className="mt-0.5 shrink-0 text-whatsapp-deep"
						/>
						<div className="min-w-0">
							<p className="text-[14.5px] font-semibold leading-snug text-ink">
								{title}
							</p>
							<p className="mt-0.5 text-[13.5px] leading-[1.55] text-ink-soft">
								{description}
							</p>
						</div>
					</li>
				))}
			</ul>

			<div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
				<p className="text-[12.5px] leading-snug text-muted sm:max-w-[30ch]">
					Breaking a rule can lead to a warning, a mute or removal from the
					group.
				</p>
				<a
					href={community.whatsappInvite}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex h-11 shrink-0 items-center justify-center gap-2.5 rounded-full bg-whatsapp pl-4 pr-5 text-[14.5px] font-semibold text-white transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp-deep"
				>
					<WhatsAppMark size={18} />
					Join the group
					<ArrowUpRight size={15} className="-ml-1 opacity-80" />
				</a>
			</div>
		</DialogShell>
	);
}
