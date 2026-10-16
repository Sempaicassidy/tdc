"use client";

import Image from "next/image";
import { useState } from "react";
import type { Member } from "@/data/members";
import { avatarUrl, fallbackTone, initials } from "@/lib/members";
import { cn } from "@/lib/utils";

type MemberAvatarProps = {
	member: Member;
	className?: string;
	initialsClassName?: string;
};

export function MemberAvatar({
	member,
	className,
	initialsClassName,
}: MemberAvatarProps) {
	const [failed, setFailed] = useState(false);
	if (failed) {
		return (
			<span
				className={cn(
					"absolute inset-0 grid place-items-center font-bold text-white/90 font-stretch-expanded",
					initialsClassName,
				)}
				style={{ backgroundColor: fallbackTone(member.name) }}
			>
				{initials(member.name)}
			</span>
		);
	}
	return (
		<Image
			src={avatarUrl(member)}
			alt=""
			fill
			unoptimized
			draggable={false}
			onError={() => setFailed(true)}
			className={cn("object-cover", className)}
		/>
	);
}
