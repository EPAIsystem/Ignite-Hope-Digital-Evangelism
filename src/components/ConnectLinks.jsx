import { useEffect, useState } from "react";
import { MessageCircle, Send, ExternalLink, Music2, Globe, Mail } from "lucide-react";
import { getConnectLinks, CONNECT_PLATFORMS } from "../lib/store";

const ICONS = {
  whatsapp: MessageCircle,
  telegram: Send,
  instagram: ExternalLink,
  youtube: ExternalLink,
  tiktok: Music2,
  facebook: ExternalLink,
  website: Globe,
  email: Mail,
};

export default function ConnectLinks({ className = "" }) {
  const [links, setLinks] = useState({});

  useEffect(() => {
    getConnectLinks().then(setLinks);
  }, []);

  const active = CONNECT_PLATFORMS.filter((p) => links[p.key]);
  if (active.length === 0) return null;

  return (
    <div className={className}>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-soft dark:text-flame-300">Connect with us</p>
      <div className="flex flex-wrap justify-center gap-2">
        {active.map((p) => {
          const Icon = ICONS[p.key];
          const href = p.key === "email" ? `mailto:${links[p.key]}` : links[p.key];
          return (
            <a key={p.key} href={href} target={p.key === "email" ? undefined : "_blank"} rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-flame-200 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-3.5 py-2 text-xs font-medium text-flame-800 dark:text-gold-500 hover:bg-flame-50 dark:hover:bg-flame-800">
              <Icon size={14} />
              {p.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
