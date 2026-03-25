"use client";

import DiscordIntegrationWidget from "@/app/components/DiscordIntegrationWidget/DiscordIntegrationWidget";
import SteamIntegrationWidget from "@/app/components/SteamIntegrationWidget/SteamIntegrationWidget";
import { motion } from "motion/react";

const page = () => {
  return (
    <section>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold"
      >
        Интеграции
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-sm text-neutral-400"
      >
        Все интеграции пользователя
      </motion.p>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <DiscordIntegrationWidget />
        <SteamIntegrationWidget />
      </div>
    </section>
  );
};

export default page;
