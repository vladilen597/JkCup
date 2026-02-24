"use client";

import DeleteUserModalContent from "@/app/components/DeleteUserModalContent/DeleteUserModalContent";
import CustomModal from "@/app/components/Shared/CustomModal/CustomModal";
import UserList from "@/app/components/UserList/UserList";
import { IUser } from "@/app/utils/store/userSlice";
import { Users, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Title from "@/app/components/Title/Title";

const UsersPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");

  const handleCloseModal = () => {
    setUserId("");
  };

  const handleLoadUsers = async () => {
    try {
      const { data } = await axios.get("/api/users");

      console.log("data", data);

      setUsers(data.users || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="text-primary"
        >
          <Loader2 className="h-8 w-8" />
        </motion.div>
        Загрузка пользователей...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">{error}</div>;
  }

  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl neon-border p-8 md:p-12 mb-10 bg-linear-to-br from-background to-muted/30"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <Title title="Пользователи" />
          </div>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Все зарегистрированные участники платформы. Найдите друзей,
            соперников или просто посмотрите, кто уже здесь!
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
      >
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Всего пользователей"
          value={users.length.toString()}
          highlight
        />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          Список пользователей ({users.length})
        </h2>

        <UserList
          users={users}
          showRoles
          emptyMessage="Пока нет зарегистрированных пользователей"
          handleClickDelete={setUserId}
        />
      </motion.section>

      <CustomModal isOpen={!!userId} onClose={handleCloseModal}>
        <DeleteUserModalContent
          userId={userId}
          onClose={handleCloseModal}
          onSubmit={handleLoadUsers}
        />
      </CustomModal>
    </main>
  );
};

function StatCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl p-5 bg-card border border-border/50 hover:border-primary/30 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm text-muted-foreground font-medium">
          {label}
        </span>
      </div>
      <span
        className={`text-2xl font-bold font-mono ${highlight ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}

export default UsersPage;
