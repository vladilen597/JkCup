"use client";

import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import {
  Trophy,
  ChevronDown,
  Users,
  Archive,
  Gamepad2,
  Ellipsis,
  Bell,
  Menu,
  FileQuestionMark,
  NotebookPen,
  Vote,
} from "lucide-react";
import { setCurrentUser } from "@/app/utils/store/userSlice";
import { AnimatePresence } from "motion/react";
import Discord from "../../Icons/Discord";
import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import CustomButton from "../CustomButton/CustomButton";
import CustomNodeSelect from "../CustomNodeSelect/CustomNodeSelect";
import CustomDrawer from "../CustomDrawer/CustomDrawer";
import Notifications from "../../Notifications/Notifications";
import Image from "next/image";
import { roleColors, roles } from "@/app/(app)/users/[id]/layout";
import { cn } from "@/lib/utils";
import axios from "axios";
import CustomModal from "../CustomModal/CustomModal";
import AuthModalContent from "../../AuthModalContent/AuthModalContent";
import { IUser } from "@/app/lib/types";
import RoleBadge from "../RoleBadge/RoleBadge";
import NotificationsBlock from "../../NotificationsBlock/NotificationsBlock";

const linkIconClassname = "h-4 w-4 text-primary";

type ReferrerPolicy =
  | "no-referrer"
  | "no-referrer-when-downgrade"
  | "origin"
  | "origin-when-cross-origin"
  | "same-origin"
  | "strict-origin"
  | "strict-origin-when-cross-origin"
  | "unsafe-url";

const links: {
  id: number;
  title: string;
  href: string;
  icon: ReactNode;
  target?: string;
  referrerPolicy?: ReferrerPolicy;
}[] = [
  {
    id: 1,
    title: "Турниры",
    href: "/tournaments",
    icon: <Trophy className={linkIconClassname} />,
  },
  {
    id: 2,
    title: "Пользователи",
    href: "/users",
    icon: <Users className={linkIconClassname} />,
  },
  {
    id: 3,
    title: "Discord",
    href: "https://discord.gg/S6QMcETh4d",
    icon: <Discord fill="#19e6d4" className="h-4 w-4 text-primary" />,
    target: "_blank",
    referrerPolicy: "no-referrer",
  },
];

const mobileLinks = links.concat([
  {
    id: 4,
    title: "Игры",
    href: "/games",
    icon: <Gamepad2 className={linkIconClassname} />,
  },
  {
    id: 5,
    title: "Архив",
    href: "/archive",
    icon: <Archive className={linkIconClassname} />,
  },
  {
    id: 6,
    title: "FAQ",
    href: "/faq",
    icon: <FileQuestionMark className={linkIconClassname} />,
  },
  {
    id: 7,
    title: "Обратная связь",
    href: "/contact",
    icon: <NotebookPen className={linkIconClassname} />,
  },
  {
    id: 8,
    title: "Голосования",
    href: "/polls",
    icon: <Vote className={linkIconClassname} />,
  },
]);

const additionalOptions = [
  {
    id: 1,
    node: (
      <Link className="flex items-center gap-2 group" href="/archive">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center neon-border group-hover:neon-glow transition-shadow duration-300">
          <Archive className="h-4 w-4 text-primary" />
        </div>
        <span className="font-extrabold text-lg tracking-tight text-foreground">
          Архив
        </span>
      </Link>
    ),
  },
  {
    id: 2,
    node: (
      <Link className="flex items-center gap-2 group" href="/games">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center neon-border group-hover:neon-glow transition-shadow duration-300">
          <Gamepad2 className="h-4 w-4 text-primary" />
        </div>
        <span className="font-extrabold text-lg tracking-tight text-foreground">
          Игры
        </span>
      </Link>
    ),
  },
  {
    id: 3,
    node: (
      <Link className="flex items-center gap-2 group" href="/faq">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center neon-border group-hover:neon-glow transition-shadow duration-300">
          <FileQuestionMark className="h-4 w-4 text-primary" />
        </div>
        <span className="font-extrabold text-lg tracking-tight text-foreground">
          FAQ
        </span>
      </Link>
    ),
  },
  {
    id: 4,
    node: (
      <Link className="flex items-center gap-2 group" href="/contact">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center neon-border group-hover:neon-glow transition-shadow duration-300">
          <NotebookPen className="h-4 w-4 text-primary" />
        </div>
        <span className="font-extrabold text-lg tracking-tight text-foreground">
          Обратная связь
        </span>
      </Link>
    ),
  },
  {
    id: 5,
    node: (
      <Link className="flex items-center gap-2 group" href="/polls">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center neon-border group-hover:neon-glow transition-shadow duration-300">
          <Vote className="h-4 w-4 text-primary" />
        </div>
        <span className="font-extrabold text-lg tracking-tight text-foreground">
          Голосования
        </span>
      </Link>
    ),
  },
];

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNavigationDrawerOpen, setIsNavigationDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { currentUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCloseProfileDropdown = () => {
    setIsProfileOpen(false);
  };

  const handleCloseNavDrawer = () => {
    setIsNavigationDrawerOpen(false);
  };

  const handleOpenNavDrawer = () => {
    setIsNavigationDrawerOpen(true);
  };

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/signout");

      dispatch(setCurrentUser(null));

      window.location.href = "/";
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  const handleLoadUser = async () => {
    try {
      const { data } = await axios.get<IUser>("/api/users/" + currentUser.id);

      if (data) {
        dispatch(setCurrentUser(data));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Ошибка загрузки профиля:",
          error.response?.data || error.message,
        );
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      handleLoadUser();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          className="block lg:hidden"
          type="button"
          onClick={handleOpenNavDrawer}
        >
          <Menu />
        </button>
        <AnimatePresence>
          {isNavigationDrawerOpen && (
            <CustomDrawer
              className="min-w-auto w-fit"
              title="Навигация"
              position="left"
              onClose={handleCloseNavDrawer}
            >
              <div className="flex flex-col gap-8 px-6 w-fit">
                {mobileLinks.map((mobileLink) => (
                  <Link
                    key={mobileLink.id}
                    href={mobileLink.href}
                    target={mobileLink.target}
                    referrerPolicy={mobileLink.referrerPolicy}
                    onClick={
                      mobileLink.target
                        ? undefined
                        : () => handleCloseNavDrawer()
                    }
                    className="flex items-center gap-2 group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center neon-border group-hover:neon-glow transition-shadow duration-300">
                      {mobileLink.icon}
                    </div>
                    <span className="font-extrabold text-lg tracking-tight text-foreground">
                      {mobileLink.title}
                    </span>
                  </Link>
                ))}
              </div>
            </CustomDrawer>
          )}
        </AnimatePresence>
        <div className="lg:flex hidden items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              target={link.target}
              referrerPolicy={link.referrerPolicy}
              className="select-none flex items-center gap-2 group"
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center neon-border group-hover:neon-glow transition-shadow duration-300">
                {link.icon}
              </div>
              <span className="font-extrabold text-lg tracking-tight text-foreground">
                {link.title}
              </span>
            </Link>
          ))}
          <CustomNodeSelect
            titleNode={
              <div className="select-none flex items-center gap-2 group cursor-pointer">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center neon-border group-hover:neon-glow transition-shadow duration-300">
                  <Ellipsis className="h-4 w-4 text-primary" />
                </div>
                <span className="font-extrabold text-lg tracking-tight text-foreground">
                  Дополнительно
                </span>
              </div>
            }
            options={additionalOptions}
          />
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.id ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen((p) => !p)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div>
                  <span className="block text-sm text-right font-inter text-foreground font-bold">
                    {currentUser.full_name}
                  </span>
                  <RoleBadge role={currentUser.role} type="small" />
                </div>
                {currentUser.image_url ? (
                  <Image
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full ring-2 ring-primary/30 object-cover"
                    src={currentUser.image_url}
                    alt={currentUser.full_name}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex items-center justify-center text-neon h-8 w-8 rounded-full ring-2 ring-primary/30">
                    {currentUser.full_name?.[0]}
                  </div>
                )}
                <ChevronDown
                  className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <ProfileDropdown
                    userId={currentUser.id}
                    handleClickLogout={handleLogout}
                    onClose={handleCloseProfileDropdown}
                  />
                )}
              </AnimatePresence>
            </div>
          ) : (
            <CustomButton label="Войти" onClick={handleOpenAuthModal} />
          )}
          {currentUser?.id && <NotificationsBlock />}
        </div>
      </div>
    </header>
  );
};

export default Header;
