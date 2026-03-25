import { motion } from "framer-motion";

interface SocialLinkProps {
  platform: "steam" | "discord";
  nickname: string;
  url?: string;
}

const platformConfig = {
  steam: {
    label: "Steam",
    color: "text-steam",
    hoverBg: "hover:bg-steam/10",
    borderColor: "border-steam/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2a10 10 0 0 0-9.96 9.04l5.35 2.21a2.83 2.83 0 0 1 1.6-.49h.08l2.39-3.46v-.05a3.79 3.79 0 1 1 3.79 3.79h-.09l-3.4 2.43a2.85 2.85 0 0 1-5.66.44L.78 13.58A10 10 0 1 0 12 2zm-4.89 14.5l-1.21-.5a2.13 2.13 0 0 0 3.88.54 2.13 2.13 0 0 0-1.12-2.8l1.25.52a1.56 1.56 0 0 1-.87 3 1.56 1.56 0 0 1-1.93-.76zm8.68-5.26a2.53 2.53 0 1 0-2.52-2.53 2.53 2.53 0 0 0 2.52 2.53zm0-4.22a1.69 1.69 0 1 1-1.69 1.69 1.69 1.69 0 0 1 1.69-1.69z" />
      </svg>
    ),
  },
  discord: {
    label: "Discord",
    color: "text-discord",
    hoverBg: "hover:bg-discord/10",
    borderColor: "border-discord/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.11 13.11 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
};

const SocialLink = ({ platform, nickname, url }: SocialLinkProps) => {
  const config = platformConfig[platform];

  const content = (
    <motion.div
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-surface-2 ${config.borderColor} ${config.hoverBg} transition-colors duration-200 cursor-pointer group`}
    >
      <span
        className={`${config.color} transition-transform duration-200 group-hover:scale-110`}
      >
        {config.icon}
      </span>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          {config.label}
        </span>
        <span className="text-sm font-medium text-foreground truncate">
          {nickname}
        </span>
      </div>
    </motion.div>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
};

export default SocialLink;
