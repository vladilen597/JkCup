"use client";

import DeleteUserModalContent from "@/app/components/DeleteUserModalContent/DeleteUserModalContent";
import CustomSelect from "@/app/components/Shared/CustomSelect/CustomSelect";
import CustomModal from "@/app/components/Shared/CustomModal/CustomModal";
import SearchInput from "@/app/components/Shared/SearchInput/SearchInput";
import UserLine from "@/app/components/UserList/UserLine/UserLine";
import UserShimmer from "@/app/components/UserShimmer/UserShimmer";
import PageHero from "@/app/components/Shared/PageHero/PageHero";
import { useState, useEffect, ChangeEvent } from "react";
import { IUser } from "@/app/lib/types";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import CountUp from "react-countup";
import axios from "axios";

const roles = [
  {
    id: 1,
    label: "Все",
    value: "any",
  },
  {
    id: 2,
    label: "Гл.Админ",
    value: "superadmin",
  },
  {
    id: 3,
    label: "Админ",
    value: "admin",
  },
  {
    id: 4,
    label: "Участник",
    value: "user",
  },
  {
    id: 5,
    label: "Гость",
    value: "guest",
  },
];

const UsersPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState(roles[0]);

  const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCloseModal = () => {
    setUserId("");
  };

  const handleLoadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/users");
      setUsers(data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.respose?.data?.message || "Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "blocked" ? "active" : "blocked";

    try {
      const { data: updatedUser } = await axios.patch(
        `/api/users/${id}/status`,
        {
          status: newStatus,
        },
      );

      setUsers((prevState) =>
        prevState.map((user) => (user.id === id ? updatedUser : user)),
      );

      toast.success(
        newStatus === "active"
          ? "Пользователь разблокирован"
          : "Пользователь заблокирован",
      );
    } catch (error) {
      console.error("Ошибка при смене статуса:", error);
      toast.error("Не удалось изменить статус пользователя");
    }
  };

  const handleBlockClick = (id: string, status: string) => {
    toggleUserStatus(id, status);
  };

  useEffect(() => {
    handleLoadUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      (user.full_name + user.discord_full_name)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      (selectedRole.value === "any" || selectedRole.value === user?.role),
  );

  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-12">
      <PageHero
        title="Пользователи"
        icon={<Users className="h-8 w-8 text-primary" />}
        description="Все зарегистрированные участники платформы. Найдите друзей,
            соперников или просто посмотрите, кто уже здесь!"
      />

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
        <h2 className="flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" />
          <span className="text-xl font-mono ">Список пользователей</span>
        </h2>
        <div className="mt-2 flex items-stretch gap-2">
          <SearchInput value={searchQuery} onChange={handleChangeQuery} />
          <CustomSelect
            containerClassName="min-w-40 border"
            options={roles}
            value={selectedRole}
            onChange={setSelectedRole}
          />
        </div>

        {error && (
          <div className="text-center py-12 text-destructive">{error}</div>
        )}

        <ul className="mt-2 flex flex-col gap-2">
          {loading ? (
            <UserShimmer />
          ) : (
            filteredUsers.map((user, i) => (
              <UserLine
                key={user.id}
                {...user}
                index={i}
                showRoles
                onDeleteClick={() => setUserId(user.id)}
                onBlockClick={() => handleBlockClick(user.id, user.status)}
              />
            ))
          )}
        </ul>
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
      <CountUp
        className="text-2xl font-bold font-mono text-primary"
        start={0}
        end={+value}
      />
    </div>
  );
}

export default UsersPage;
