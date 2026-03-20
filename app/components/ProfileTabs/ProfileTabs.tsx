import { useParams, usePathname } from "next/navigation";
import { Link as LinkIcon, User } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ProfileTabs = () => {
  const pathname = usePathname();
  const { id } = useParams();

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
      name: "Интеграции",
      link: `/users/${id}/integrations`,
      slug: "integrations",
      icon: <LinkIcon className="w-4 h-4" />,
    },
  ];

  return (
    <nav>
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
    </nav>
  );
};

export default ProfileTabs;
