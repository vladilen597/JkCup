import { motion } from "framer-motion";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar";
import RoleBadge from "../../Shared/RoleBadge/RoleBadge";
import SocialLink from "../../Shared/SocialLink/SocialLink";
import { IUser } from "@/app/lib/types";
import CustomSkeleton from "../../Shared/CustomSkeleton/CustomSkeleton";

interface ProfileHeaderProps {
  user: IUser;
  isCurrentUser: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  onImageChange?: (file: File) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const ProfileHeader = ({
  user,
  isCurrentUser,
  isAdmin,
  isSuperAdmin,
  onImageChange,
}: ProfileHeaderProps) => {
  const isLoading = !user.id;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative"
    >
      <div className="absolute inset-0 -top-8 h-40 bg-linear-to-b from-primary/15 to-transparent rounded-3xl pointer-events-none" />

      <div className="min-h-64.25 relative flex flex-col sm:flex-row gap-6 sm:gap-8 items-start p-6 sm:p-8">
        {isLoading ? (
          <CustomSkeleton height={128} width={128} borderRadius={16} />
        ) : (
          <motion.div variants={item}>
            <ProfileAvatar
              imageUrl={user.image_url}
              fullName={user.full_name}
              isEditable={isCurrentUser}
              onImageChange={onImageChange}
            />
          </motion.div>
        )}

        <div className="flex-1 min-w-0 flex flex-col gap-3 pt-1">
          {isLoading ? (
            <CustomSkeleton height={36} width={240} />
          ) : (
            <motion.h1
              variants={item}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground overflow-wrap-anywhere"
              style={{ textWrap: "balance" }}
            >
              {user.full_name}
            </motion.h1>
          )}

          {(isAdmin || isSuperAdmin) && user.email && (
            <>
              {isLoading ? (
                <CustomSkeleton height={20} width={240} />
              ) : (
                <motion.p
                  variants={item}
                  className="text-sm font-mono text-muted-foreground"
                >
                  {user.email}
                </motion.p>
              )}
            </>
          )}

          {isLoading ? (
            <CustomSkeleton width={116} height={26} borderRadius={12} />
          ) : (
            <motion.div variants={item}>
              <RoleBadge role={user.role} />
            </motion.div>
          )}

          {(user.steam_name || user.discord_full_name) && (
            <motion.div variants={item} className="flex flex-wrap gap-3 mt-2">
              {user.steam_name && (
                <SocialLink
                  platform="steam"
                  nickname={user.steam_name}
                  url={user.steam_profile_url}
                />
              )}
              {user.discord_full_name && (
                <SocialLink
                  platform="discord"
                  nickname={user.discord_full_name}
                />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
