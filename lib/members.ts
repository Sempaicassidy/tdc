import { community } from "@/data/community";
import type { Member } from "@/data/members";
import {
	categoryLabels,
	categoryTagLabels,
	skillCategories,
	type SkillCategory,
} from "@/data/skills";

export type Tag =
	| { kind: "skill"; key: string; label: string; value: string }
	| { kind: "category"; key: string; label: string; value: SkillCategory }
	| { kind: "open"; key: string; label: string };

export const openToWorkTag: Tag = {
	kind: "open",
	key: "open",
	label: "Open to work",
};

export function skillTag(value: string): Tag {
	return { kind: "skill", key: `skill:${value}`, label: value, value };
}

export function categoryTag(value: SkillCategory): Tag {
	return {
		kind: "category",
		key: `category:${value}`,
		label: categoryTagLabels[value] ?? categoryLabels[value],
		value,
	};
}

export function memberId(member: Member) {
	return member.github.toLowerCase();
}

export function avatarUrl(member: Member) {
	return member.avatar ?? `https://github.com/${member.github}.png?size=320`;
}

export function initials(name: string) {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	const first = parts[0]?.[0] ?? "";
	const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
	return `${first}${last}`.toUpperCase();
}

export function skillsOf(member: Member): string[] {
	if (!member.skills) return [];
	return skillCategories.flatMap((category) => member.skills?.[category] ?? []);
}

function haystack(member: Member) {
	const parts: string[] = [
		member.name,
		member.github,
		member.title ?? "",
		member.location ?? "",
		member.bio ?? "",
		...skillsOf(member),
	];
	for (const category of skillCategories) {
		if (member.skills?.[category]?.length) parts.push(categoryLabels[category]);
	}
	if (member.openToWork)
		parts.push("open to work", "hire", "available", "freelance");
	return parts.join(" ").toLowerCase();
}

const haystackCache = new WeakMap<Member, string>();

export function matchesQuery(member: Member, query: string) {
	const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
	if (terms.length === 0) return true;
	let text = haystackCache.get(member);
	if (!text) {
		text = haystack(member);
		haystackCache.set(member, text);
	}
	return terms.every((term) => text.includes(term));
}

export function matchesTag(member: Member, tag: Tag) {
	if (tag.kind === "open") return Boolean(member.openToWork);
	if (tag.kind === "category")
		return (member.skills?.[tag.value]?.length ?? 0) > 0;
	return skillsOf(member).includes(tag.value);
}

export function matchesFilters(member: Member, query: string, tags: Tag[]) {
	return (
		matchesQuery(member, query) && tags.every((tag) => matchesTag(member, tag))
	);
}

export function buildTagPool(list: Member[]) {
	const pool = new Map<string, { tag: Tag; weight: number }>();
	const bump = (tag: Tag) => {
		const entry = pool.get(tag.key);
		if (entry) entry.weight += 1;
		else pool.set(tag.key, { tag, weight: 1 });
	};
	for (const member of list) {
		for (const skill of new Set(skillsOf(member))) bump(skillTag(skill));
		for (const category of skillCategories) {
			if (categoryTagLabels[category] && member.skills?.[category]?.length) {
				bump(categoryTag(category));
			}
		}
		if (member.openToWork) bump(openToWorkTag);
	}
	return [...pool.values()];
}

export function pickTags(
	pool: { tag: Tag; weight: number }[],
	count: number,
	keep: Tag[] = [],
) {
	const chosen: Tag[] = [...keep];
	const taken = new Set(keep.map((tag) => tag.key));
	const bag = pool.filter((entry) => !taken.has(entry.tag.key));
	while (chosen.length < count && bag.length > 0) {
		const total = bag.reduce((sum, entry) => sum + Math.sqrt(entry.weight), 0);
		let roll = Math.random() * total;
		let index = 0;
		for (; index < bag.length - 1; index++) {
			roll -= Math.sqrt(bag[index].weight);
			if (roll <= 0) break;
		}
		chosen.push(bag[index].tag);
		bag.splice(index, 1);
	}
	return chosen;
}

export function normalizeUrl(url: string) {
	return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function displayUrl(url: string) {
	return url
		.replace(/^https?:\/\//i, "")
		.replace(/^www\./i, "")
		.replace(/\/$/, "");
}

export function githubUrl(member: Member) {
	return `https://github.com/${member.github}`;
}

export function xUrl(handle: string) {
	return `https://x.com/${handle.replace(/^@/, "")}`;
}

function isEmail(value: string) {
	return /^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(value);
}

export function hireHref(member: Member) {
	if (!member.openToWork) return null;
	const contact =
		member.hireContact ??
		member.links?.email ??
		member.links?.linkedin ??
		member.links?.website ??
		githubUrl(member);
	if (isEmail(contact)) {
		const subject = encodeURIComponent(
			`Work opportunity via ${community.shortName}`,
		);
		return `mailto:${contact}?subject=${subject}`;
	}
	return normalizeUrl(contact);
}

const fallbackTones = [
	"#2F5D46",
	"#245A78",
	"#7A5A1E",
	"#5A4670",
	"#6E3A33",
	"#3D5560",
];

export function fallbackTone(name: string) {
	let hash = 0;
	for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
	return fallbackTones[hash % fallbackTones.length];
}

export function richness(member: Member) {
	const links = Object.values(member.links ?? {}).filter(Boolean).length;
	return (
		(member.bio ? 3 : 0) +
		skillsOf(member).length / 3 +
		links / 2 +
		(member.title ? 1 : 0)
	);
}
