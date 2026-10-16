import {
  AtSign,
  Ban,
  CircleHelp,
  Code,
  GraduationCap,
  Handshake,
  Languages,
  Link,
  Lock,
  MessageSquareText,
  Target,
  type LucideIcon,
} from "lucide-react";

export type Rule = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const rules: Rule[] = [
  {
    icon: Handshake,
    title: "Be respectful",
    description:
      "Treat every member with respect. Harassment, hate speech and personal attacks are not tolerated.",
  },
  {
    icon: Ban,
    title: "No spam",
    description:
      "Skip irrelevant messages, repeated self promotion and unsolicited adverts.",
  },
  {
    icon: Code,
    title: "Stay on topic",
    description:
      "Keep conversations about technology, software development and the work around it.",
  },
  {
    icon: Lock,
    title: "Respect privacy",
    description:
      "Never share another member's personal details without their consent. What is shared in the group stays in the group.",
  },
  {
    icon: GraduationCap,
    title: "Share knowledge",
    description:
      "Help other developers with resources, answers and honest feedback.",
  },
  {
    icon: Languages,
    title: "Use clear language",
    description:
      "Write in English or Swahili. Keep it clear and professional, with light use of slang.",
  },
  {
    icon: CircleHelp,
    title: "Ask good questions",
    description:
      "Search before you ask. When you need help, include context, what you tried and the exact error.",
  },
  {
    icon: Link,
    title: "Share links responsibly",
    description:
      "Only post links that are safe, relevant and useful to the community.",
  },
  {
    icon: AtSign,
    title: "No @everyone mentions",
    description: "Mentioning everyone notifies hundreds of people. Avoid it.",
  },
  {
    icon: Target,
    title: "Quality over quantity",
    description:
      "One thoughtful message beats ten quick ones. Avoid flooding the chat.",
  },
  {
    icon: MessageSquareText,
    title: "Keep feedback constructive",
    description:
      "When reviewing code or ideas, focus on the solution, never the person.",
  },
];
