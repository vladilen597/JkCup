"use client";

import ChangePasswordBlock from "@/app/components/ChangePasswordBlock/ChangePasswordBlock";
import { useAppSelector } from "@/app/utils/store/hooks";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

const SecurityPage = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const { id } = useParams();
  const router = useRouter();

  if (!currentUser?.id || currentUser?.id !== id) {
    router.replace(`/users/${id}/profile`);
  }

  return (
    <section>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold"
      >
        Безопасность
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-sm text-neutral-400"
      >
        Измените настройки безопасности аккаунта
      </motion.p>
      <div className="mt-2">
        <ChangePasswordBlock />
      </div>
    </section>
  );
};

export default SecurityPage;
