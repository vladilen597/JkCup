import { useParams, usePathname } from "next/navigation";
import Discord from "../Icons/Discord";
import { User } from "lucide-react";
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
      name: "Discord",
      link: `/users/${id}/discord`,
      slug: "discord",
      icon: <Discord className="w-4 h-4" />,
    },
  ];

  return (
    <nav>
      <ul className="flex items-center gap-2">
        {tabLinks.map((tab) => {
          const isActive = pathname.includes(tab.slug);
          return (
            <li
              key={tab.id}
              className={cn(
                "flex items-center gap-2 rounded-lg border border-border!",
                isActive && "border-neon!",
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
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default ProfileTabs;
