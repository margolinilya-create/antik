import { Phone, Send, Mail } from "lucide-react";
import { site } from "@/lib/site";

const channels = [
  { Icon: Phone, label: site.phone, href: site.phoneHref },
  { Icon: Send, label: "Telegram", href: site.telegramHref },
  { Icon: Mail, label: site.email, href: site.emailHref },
];

export function ContactChannels({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {channels.map(({ Icon, label, href }) => (
        <a
          key={label}
          href={href}
          className="inline-flex items-center gap-2 border border-line px-4 py-2.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
        >
          <Icon className="size-4" strokeWidth={1.5} aria-hidden />
          {label}
        </a>
      ))}
    </div>
  );
}
