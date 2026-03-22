import { IUser } from "@/app/lib/types";
import axios from "axios";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useAppSelector } from "@/app/utils/store/hooks";
import { ChevronRight, ExternalLink, Lock, X } from "lucide-react";
import RoleSelect from "../Shared/RoleSelect/RoleSelect";
import RoleBadge from "../Shared/RoleBadge/RoleBadge";
import { roleSelectOptions } from "../UserList/UserLine/UserLine";
import { cn } from "@/lib/utils";
import UserInfoBlock from "../Shared/UserInfoBlock/UserInfoBlock";
import SocialLink from "../Shared/SocialLink/SocialLink";
import CustomButton from "../Shared/CustomButton/CustomButton";
import Link from "next/link";

const containerVariants = {
  expanded: {},
  collapsed: {},
};

const contentVariants = {
  expanded: {},
  collapsed: {},
};

const arrowVariants = {
  expanded: {
    transform: "rotate(90deg)",
  },
  collapsed: {
    transform: "rotate(0deg)",
  },
};

const UserExpandableLine = ({ user }: { user: IUser }) => {
  const {
    id,
    full_name,
    image_url,
    discord_id,
    discord_full_name,
    role,
    steam_name,
    steam_profile_url,
    status,
  } = user;
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentUser } = useAppSelector((state) => state.user);
  const [userRole, setUserRole] = useState<{
    id: number;
    value: string;
    label: string;
  }>({
    id: 1,
    value: "guest",
    label: "Гость",
  });

  const isSuperAdmin = currentUser?.role === "superadmin";
  const isCurrentUser = currentUser?.id === id;

  const handleUpdateRole = async (value: {
    id: number;
    value: string;
    label: string;
  }) => {
    const oldRole = userRole;
    setUserRole(value);
    try {
      await axios.post("/api/users/user/update/role", {
        userId: id,
        newRole: value.value,
      });
    } catch (error) {
      console.log(error);
      setUserRole(oldRole);
    }
  };

  const handleToggleExpanded = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <motion.li
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
      transition={{ duration: 0.3 }}
      className={`rounded-lg bg-muted/40 hover:bg-muted/70 border border-border/50 transition-all duration-200 group cursor-pointer overflow-hidden ${
        role === "superadmin" ? "border-neon" : ""
      }`}
      onClick={handleToggleExpanded}
      variants={containerVariants}
    >
      <div className="flex items-center gap-3 p-3 ">
        {image_url ? (
          <Image
            unoptimized
            width={40}
            height={40}
            src={image_url}
            alt={full_name || ""}
            className={cn(
              "w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all",
            )}
          />
        ) : (
          <div
            className={cn(
              "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm ring-2 ring-primary/20",
            )}
          >
            {full_name?.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-semibold text-foreground truncate leading-4 text-sm",
            )}
          >
            {full_name}
          </p>
          {isCurrentUser && (
            <p className="leading-4">
              <span className="text-xs leading-0 text-orange-400">Вы</span>
            </p>
          )}
        </div>
        {isSuperAdmin && currentUser?.id !== id && role !== "superadmin" ? (
          <RoleSelect
            value={userRole}
            onChange={handleUpdateRole}
            options={roleSelectOptions}
          />
        ) : (
          <RoleBadge role={role} />
        )}
        <motion.div
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          exit="collapsed"
          variants={arrowVariants}
        >
          <ChevronRight className="text-neutral-400 h-4 w-4" />
        </motion.div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden flex items-center justify-between"
          >
            <div className="px-4 pb-4 flex items-center gap-2">
              {steam_name && steam_profile_url && (
                <SocialLink
                  platform="steam"
                  nickname={steam_name}
                  url={steam_profile_url}
                />
              )}
              {discord_full_name && (
                <SocialLink
                  platform="discord"
                  nickname={discord_full_name}
                  url={`discord://-/users/${discord_id}`}
                />
              )}
            </div>

            <div className="flex items-center gap-2 p-4">
              {currentUser?.role === "superadmin" && role !== "superadmin" && (
                <button
                  type="button"
                  className="cursor-pointer hover:bg-background/60 rounded-full transition-colors p-1.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    //   onBlockClick();
                  }}
                >
                  <Lock
                    style={
                      status === "blocked"
                        ? { color: "#fb2c36" }
                        : { color: "#737373" }
                    }
                    className="w-4 h-4 transition-colors"
                  />
                </button>
              )}
              {currentUser?.role === "superadmin" &&
                role !== "superadmin" &&
                currentUser?.id !== id && (
                  <button
                    className="cursor-pointer hover:bg-background/60 rounded-full p-1 transition-colors"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      //   onDeleteClick();
                    }}
                  >
                    <X className="w-5 h-5 text-neutral-400" />
                  </button>
                )}
              <Link
                className="flex items-center gap-2 rounded-lg border border-border p-2 text-xs"
                href={`/users/${id}/profile`}
              >
                <ExternalLink className="w-4 h-4" /> В профиль
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

export default UserExpandableLine;
