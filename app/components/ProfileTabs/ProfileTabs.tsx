import { useParams, usePathname } from "next/navigation";
import {
  ChartNoAxesColumn,
  Link as LinkIcon,
  ShieldCheck,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAppSelector } from "@/app/utils/store/hooks";

const ProfileTabs = () => {
  const pathname = usePathname();
  const { id } = useParams();
  const { currentUser } = useAppSelector((state) => state.user);

  const tabLinks = [
    {
      id: 1,
      name: "Профиль",
      link: `/users/${id}/profile`,
      slug: "profile",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: 2,
      name: "Обзор",
      link: `/users/${id}/info`,
      slug: "info",
      icon: <ChartNoAxesColumn className="w-4 h-4" />,
    },
    {
      id: 3,
      name: "Интеграции",
      link: `/users/${id}/integrations`,
      slug: "integrations",
      icon: <LinkIcon className="w-4 h-4" />,
    },
    ...(currentUser?.id === id
      ? [
          {
            id: 4,
            name: "Безопасность",
            link: `/users/${id}/security`,
            slug: "security",
            icon: <ShieldCheck className="w-4 h-4" />,
          },
        ]
      : []),
  ];

  return (
    <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ul className="flex items-center gap-2 font-inter">
        {tabLinks.map((tab) => {
          const isActive = pathname.includes(tab.slug);
          return (
            <li
              key={tab.id}
              className={cn(
                "relative flex items-center gap-2 text-neutral-400 hover:text-white transition-colors",
                isActive && "text-white",
              )}
            >
              <Link
                href={tab.link}
                className="flex items-center gap-2 py-2 px-4"
              >
                <span>{tab.icon}</span>
                <span className={cn("text-sm", isActive && "font-bold")}>
                  {tab.name}
                </span>
              </Link>
              {isActive && (
                <motion.div
                  key={tab.id}
                  layout="position"
                  layoutId="profile-active-link-underline"
                  className="absolute top-full h-1 w-full bg-primary"
                />
              )}
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
};

export default ProfileTabs;
