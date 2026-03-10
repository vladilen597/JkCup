"use client";

import DeleteUserModalContent from "@/app/components/DeleteUserModalContent/DeleteUserModalContent";
import CustomModal from "@/app/components/Shared/CustomModal/CustomModal";
import SearchInput from "@/app/components/Shared/SearchInput/SearchInput";
import UserLine from "@/app/components/UserList/UserLine/UserLine";
import UserShimmer from "@/app/components/UserShimmer/UserShimmer";
import { useState, useEffect, ChangeEvent } from "react";
import { IUser } from "@/app/utils/store/userSlice";
import Title from "@/app/components/Title/Title";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import CountUp from "react-countup";
import axios from "axios";
import CustomSelect from "@/app/components/Shared/CustomSelect/CustomSelect";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";

const roles = [
  {
    id: 1,
    label: "Все",
    value: "any",
  },
  {
    id: 2,
    label: "Суперадмин",
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
      setUsers(data.users || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockUser = async (id: string) => {
    try {
      await axios.post("/api/users/enable", {
        id,
      });
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        status: "active",
      });
      setUsers((prevState) =>
        prevState.map((user) => {
          if (user.uid === id) {
            return {
              ...user,
              status: "active",
            };
          }
          return user;
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlockUser = async (id: string) => {
    try {
      await axios.post("/api/users/disable", {
        id,
      });
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        status: "blocked",
      });
      setUsers((prevState) =>
        prevState.map((user) => {
          if (user.uid === id) {
            return {
              ...user,
              status: "blocked",
            };
          }
          return user;
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlockClick = (id: string, status: "blocked" | "active") => {
    if (status === "active" || typeof status === "undefined") {
      handleBlockUser(id);
    } else {
      handleUnlockUser(id);
    }
  };

  useEffect(() => {
    handleLoadUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      (user.displayName + user.steamDisplayName)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      (selectedRole.value === "any" || selectedRole.value === user.role),
  );

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
          Список пользователей
        </h2>
        <div className="flex items-stretch gap-2">
          <SearchInput value={searchQuery} onChange={handleChangeQuery} />
          <CustomSelect
            containerClassName="min-w-40"
            options={roles}
            value={selectedRole}
            onChange={setSelectedRole}
          />
        </div>

        <ul className="mt-2 flex flex-col gap-2">
          {loading ? (
            <UserShimmer />
          ) : (
            filteredUsers.map((user, i) => (
              <UserLine
                key={user.uid}
                {...user}
                index={i}
                showRoles
                onDeleteClick={() => setUserId(user.uid)}
                onBlockClick={() => handleBlockClick(user.uid, user.status)}
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
