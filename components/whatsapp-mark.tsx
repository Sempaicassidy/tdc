import { MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export function WhatsAppMark({ size = 24, className }: { size?: number; className?: string }) {
  const phone = size * 0.4;
  return (
    <span
      aria-hidden
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <MessageCircle size={size} strokeWidth={2} className="absolute inset-0" />
      <Phone
        className="absolute"
        fill="currentColor"
        strokeWidth={0}
        style={{
          width: phone,
          height: phone,
          left: (size - phone) / 2,
          top: (size - phone) / 2,
        }}
      />
    </span>
  );
}
