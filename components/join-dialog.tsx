"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Check, ChevronDown, Copy, Github } from "lucide-react";
import { useState, type ReactNode } from "react";
import { community, editMembersFileUrl } from "@/data/community";
import { skillCategories } from "@/data/skills";
import { DialogClose, DialogShell, type ZoomOrigin } from "./dialog-shell";

const template = `{
  name: "Your Name",
  github: "your-github-username",
  title: "Frontend Engineer",
  location: "Dar es Salaam",
  bio: "One or two sentences about what you build.",
  skills: {
    languages: ["TypeScript"],
    frontend: ["React", "Next.js"],
    design: ["Figma"],
  },
  links: {
    website: "https://your-site.dev",
    linkedin: "https://linkedin.com/in/you",
    x: "yourhandle",
  },
  openToWork: true,
  hireContact: "you@example.com",
},`;

const fields: { name: string; detail: ReactNode }[] = [
  { name: "name", detail: "Your full name. Required." },
  { name: "github", detail: "Your GitHub username. Required, your photo comes from it." },
  { name: "title", detail: "A short role, like Mobile Engineer." },
  { name: "location", detail: "A city or country." },
  { name: "bio", detail: "One or two sentences, up to 200 characters." },
  {
    name: "skills",
    detail: (
      <>
        Group them under {skillCategories.map((category, index) => (
          <span key={category}>
            <code className="text-ink">{category}</code>
            {index < skillCategories.length - 2 ? ", " : index === skillCategories.length - 2 ? " or " : ""}
          </span>
        ))}
        . Your editor suggests the allowed values from <code className="text-ink">data/skills.ts</code>, so tags
        stay consistent.
      </>
    ),
  },
  { name: "links", detail: "Any of website, linkedin, x and email." },
  { name: "openToWork", detail: "Set to true to show a Hire me button on your card." },
  {
    name: "hireContact",
    detail: "Where Hire me sends people, an email address or a link. Without it, your email, LinkedIn or website is used.",
  },
];

function highlight(source: string) {
  const parts: ReactNode[] = [];
  const pattern = /("(?:[^"\\]|\\.)*")|(\b[A-Za-z]+)(?=:)|\b(true|false)\b/g;
  let last = 0;
  for (const match of source.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(source.slice(last, index));
    const className = match[1] ? "text-code-string" : match[2] ? "text-code-key" : "text-sky";
    parts.push(
      <span key={index} className={className}>
        {match[0]}
      </span>,
    );
    last = index + match[0].length;
  }
  parts.push(source.slice(last));
  return parts;
}

type JoinDialogProps = {
  open: boolean;
  origin: ZoomOrigin | null;
  onClose: () => void;
  onExitComplete: () => void;
};

export function JoinDialog({ open, origin, onClose, onExitComplete }: JoinDialogProps) {
  return (
    <DialogShell
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      layoutId={origin ? undefined : "tile-join"}
      origin={origin}
      onExitComplete={onExitComplete}
      className="max-w-[640px]"
    >
      <JoinContent />
    </DialogShell>
  );
}

function JoinContent() {
  const [copied, setCopied] = useState(false);
  const fileName = community.membersFile;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <div className="flex items-start gap-3 p-5 pb-0 sm:p-7 sm:pb-0">
        <div className="min-w-0 flex-1">
          <Dialog.Title className="text-[26px] font-bold leading-[1.05] tracking-[-0.015em] text-ink font-stretch-expanded sm:text-[30px]">
            Add yourself to the grid
          </Dialog.Title>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-[1.6] text-ink-soft">
            Every tile on this page comes from one file in the {community.shortName} repository. Add your details
            there, open a pull request, and your tile goes live once it is merged.
          </p>
        </div>
        <DialogClose className="-mr-2 -mt-1 sm:-mr-3" />
      </div>

      <ol className="mt-7 space-y-6 px-5 sm:px-7">
        <Step number={1} title={`Open ${fileName} on GitHub`}>
          <p>GitHub makes a fork for you automatically if you do not have write access.</p>
          <a
            href={editMembersFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-ink pl-4 pr-4 text-[14px] font-semibold text-surface transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <Github size={16} />
            Edit the members file
            <ArrowUpRight size={15} className="-ml-0.5 opacity-70" />
          </a>
        </Step>

        <Step number={2} title="Paste your entry at the end of the list">
          <p>Keep the fields you need and delete the rest.</p>
          <div className="relative mt-3 overflow-hidden rounded-2xl bg-code">
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(template);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1600);
                } catch {
                  setCopied(false);
                }
              }}
              className="absolute right-2.5 top-2.5 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-white/10 px-3 text-[12.5px] font-medium text-code-ink transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
            <pre className="no-scrollbar overflow-x-auto p-4 pr-24 text-[12.5px] leading-[1.65] text-code-ink">
              <code className="font-mono">{highlight(template)}</code>
            </pre>
          </div>
        </Step>

        <Step number={3} title="Commit and open a pull request">
          <p>
            Name it something like Add Neema Mushi. A maintainer reviews it, and your tile appears here after the
            merge.
          </p>
        </Step>
      </ol>

      <details className="group mx-5 mb-6 mt-7 rounded-2xl border border-line bg-raised sm:mx-7 sm:mb-7">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-[14px] font-medium text-ink [&::-webkit-details-marker]:hidden">
          What each field means
          <ChevronDown size={16} className="text-muted transition-transform group-open:rotate-180" />
        </summary>
        <dl className="space-y-3 border-t border-line px-4 py-4 text-[13.5px] leading-[1.55]">
          {fields.map((field) => (
            <div key={field.name} className="grid gap-1 sm:grid-cols-[112px_1fr] sm:gap-4">
              <dt>
                <code className="font-mono text-[12.5px] text-ink">{field.name}</code>
              </dt>
              <dd className="text-ink-soft">{field.detail}</dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[28px_1fr] gap-x-3.5">
      <span className="grid size-7 place-items-center rounded-full border border-line-strong text-[13px] font-semibold tabular-nums text-ink">
        {number}
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="text-[15.5px] font-semibold leading-snug text-ink">{title}</p>
        <div className="mt-1 text-[14px] leading-[1.55] text-ink-soft">{children}</div>
      </div>
    </li>
  );
}
