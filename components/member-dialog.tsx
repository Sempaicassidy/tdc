"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Github,
  Globe,
  Link2,
  Linkedin,
  MapPin,
  Twitter,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Member } from "@/data/members";
import { categoryLabels, skillCategories } from "@/data/skills";
import {
  displayUrl,
  githubUrl,
  hireHref,
  memberId,
  normalizeUrl,
  richness,
  skillTag,
  xUrl,
  type Tag,
} from "@/lib/members";
import { cn } from "@/lib/utils";
import { DialogClose, DialogShell, morphTransition } from "./dialog-shell";
import { MemberAvatar } from "./member-avatar";

type MemberDialogProps = {
  member: Member | null;
  onClose: () => void;
  onPickTag: (tag: Tag) => void;
  onExitComplete: () => void;
};

function widthFor(member: Member | null) {
  if (!member) return "max-w-[400px]";
  const score = richness(member);
  if (score < 3) return "max-w-[400px]";
  if (score < 7) return "max-w-[500px]";
  return "max-w-[620px]";
}

export function MemberDialog({ member, onClose, onPickTag, onExitComplete }: MemberDialogProps) {
  const id = member ? memberId(member) : undefined;
  return (
    <DialogShell
      open={member !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      layoutId={id ? `member-${id}` : undefined}
      onExitComplete={onExitComplete}
      className={widthFor(member)}
    >
      {member && id && <MemberCard member={member} id={id} onPickTag={onPickTag} />}
    </DialogShell>
  );
}

function MemberCard({ member, id, onPickTag }: { member: Member; id: string; onPickTag: (tag: Tag) => void }) {
  const hire = hireHref(member);
  const categories = skillCategories.filter((category) => member.skills?.[category]?.length);
  const wide = richness(member) >= 7 && categories.length > 2;
  const links: { href: string; label: string; icon: ReactNode }[] = [];
  if (member.links?.website) {
    links.push({
      href: normalizeUrl(member.links.website),
      label: displayUrl(member.links.website),
      icon: <Globe size={15} />,
    });
  }
  links.push({ href: githubUrl(member), label: "GitHub", icon: <Github size={15} /> });
  if (member.links?.linkedin) {
    links.push({ href: normalizeUrl(member.links.linkedin), label: "LinkedIn", icon: <Linkedin size={15} /> });
  }
  if (member.links?.x) {
    links.push({ href: xUrl(member.links.x), label: `@${member.links.x.replace(/^@/, "")}`, icon: <Twitter size={15} /> });
  }

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="p-5 sm:p-7">
          <div className="flex items-start gap-4 sm:gap-5">
            <motion.div
              layoutId={`photo-${id}`}
              transition={morphTransition}
              style={{ borderRadius: 18 }}
              className="relative size-[88px] shrink-0 overflow-hidden bg-raised sm:size-[112px]"
            >
              <MemberAvatar member={member} initialsClassName="text-[28px]" />
            </motion.div>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-start gap-2">
                <Dialog.Title className="min-w-0 flex-1 text-[24px] font-bold leading-[1.05] tracking-[-0.015em] text-balance text-ink font-stretch-expanded sm:text-[30px]">
                  {member.name}
                </Dialog.Title>
                <div className="-mr-2 -mt-1.5 flex shrink-0 items-center sm:-mr-3 sm:-mt-2">
                  <CopyLink id={id} />
                  <DialogClose />
                </div>
              </div>
              {member.title && <p className="mt-2 text-[15px] text-ink-soft">{member.title}</p>}
              {member.location && (
                <p className="mt-1 flex items-center gap-1.5 text-[14px] text-muted">
                  <MapPin size={14} strokeWidth={2} />
                  {member.location}
                </p>
              )}
              {member.openToWork && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold/15 py-1 pl-2 pr-3 text-[12.5px] font-medium text-ink">
                  <span className="size-2 rounded-full bg-gold" />
                  Open to work
                </p>
              )}
            </div>
          </div>

          {member.bio && (
            <p className="mt-6 max-w-[62ch] text-[15.5px] leading-[1.6] text-ink-soft">{member.bio}</p>
          )}

          {categories.length > 0 && (
            <div className={cn("mt-7 grid gap-x-8 gap-y-5", wide && "sm:grid-cols-2")}>
              {categories.map((category) => (
                <div key={category}>
                  <p className="mb-2 text-[12.5px] font-medium text-muted">{categoryLabels[category]}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills?.[category]?.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => onPickTag(skillTag(skill))}
                        title={`Show everyone with ${skill}`}
                        className="h-7 cursor-pointer rounded-full border border-line bg-raised px-3 text-[13px] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-surface focus-visible:outline-2 focus-visible:outline-ink"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!member.bio && categories.length === 0 && (
            <p className="mt-6 text-[14px] leading-relaxed text-muted">
              {member.name.split(" ")[0]} has not added a bio or skills yet.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-line bg-surface px-5 py-4 sm:px-7">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 max-w-full items-center gap-2 rounded-full border border-line bg-raised px-3.5 text-[13px] font-medium text-ink-soft transition-colors hover:border-line-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-ink"
          >
            {link.icon}
            <span className="truncate">{link.label}</span>
          </a>
        ))}
        {hire && (
          <a
            href={hire}
            target={hire.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="ml-auto inline-flex h-9 items-center gap-2 rounded-full bg-ink pl-3.5 pr-4 text-[13.5px] font-semibold text-surface transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <BriefcaseBusiness size={15} />
            Hire me
            <ArrowUpRight size={14} className="-ml-0.5 opacity-70" />
          </a>
        )}
      </div>
    </>
  );
}

function CopyLink({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={copied ? "Link copied" : "Copy link to this profile"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/#${id}`);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          setCopied(false);
        }
      }}
      className="grid size-9 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-ground hover:text-ink focus-visible:outline-2 focus-visible:outline-ink"
    >
      {copied ? <Check size={16} /> : <Link2 size={16} />}
    </button>
  );
}
