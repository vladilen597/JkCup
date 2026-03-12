"use client";

import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import { useGoogleSignIn } from "@/app/utils/useGoogleSignIn";
import {
  Trophy,
  ChevronDown,
  Users,
  Archive,
  Gamepad,
  Gamepad2,
  Ellipsis,
  Bell,
  Menu,
  FileQuestionMark,
  NotebookPen,
} from "lucide-react";
import { IUser, setUser } from "@/app/utils/store/userSlice";
import { AnimatePresence } from "motion/react";
import Discord from "../../Icons/Discord";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import CustomButton from "../CustomButton/CustomButton";
import Google from "../../Icons/Google";
import CustomNodeSelect from "../CustomNodeSelect/CustomNodeSelect";
import CustomDrawer from "../CustomDrawer/CustomDrawer";
import Notifications from "../../Notifications/Notifications";
import Image from "next/image";
import { roleColors, roles } from "@/app/(app)/users/[id]/page";
import { cn } from "@/lib/utils";

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
];

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNavigationDrawerOpen, setIsNavigationDrawerOpen] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const { signIn } = useGoogleSignIn();
  const dispatch = useAppDispatch();

  const handleCloseProfileDropdown = () => {
    setIsProfileOpen(false);
  };

  const handleCloseDrawer = () => {
    setIsNotificationsOpen(false);
  };

  const handleOpenDrawer = () => {
    setIsNotificationsOpen(true);
  };

  const handleCloseNavDrawer = () => {
    setIsNavigationDrawerOpen(false);
  };

  const handleOpenNavDrawer = () => {
    setIsNavigationDrawerOpen(true);
  };

  const handleLogOut = () => {
    dispatch(
      setUser({
        uid: "",
        displayName: "Anonymous",
        photoUrl: "",
        email: "",
        role: "guest",
        discord: "",
      }),
    );
    setIsProfileOpen(false);
  };

  const handleGoogleSignIn = () => {
    signIn();
  };

  useEffect(() => {
    if (!user.uid) return;

    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data() as IUser;
          dispatch(setUser(userData));
        }
      },
      (error) => {
        console.error("Ошибка при получении данных пользователя:", error);
      },
    );

    return () => unsubscribe();
  }, [user.uid, dispatch]);

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
              className="flex items-center gap-2 group"
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
              <div className="flex items-center gap-2 group cursor-pointer">
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
          {user.uid ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen((p) => !p)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div>
                  <span className="block text-sm font-medium text-foreground">
                    {user.displayName}
                  </span>
                  <span
                    className={cn(
                      "block text-[9px] text-right",
                      roleColors[user?.role],
                    )}
                  >
                    {roles[user.role]}
                  </span>
                </div>
                <Image
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full ring-2 ring-primary/30"
                  src={user.photoUrl}
                  alt={user.displayName}
                  referrerPolicy="no-referrer"
                />
                <ChevronDown
                  className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <ProfileDropdown
                    userId={user.uid}
                    handleClickLogout={handleLogOut}
                    onClose={handleCloseProfileDropdown}
                  />
                )}
              </AnimatePresence>
            </div>
          ) : (
            <CustomButton
              label="Войти"
              icon={<Google />}
              onClick={handleGoogleSignIn}
            />
          )}
          <button
            className="cursor-pointer group"
            type="button"
            onClick={handleOpenDrawer}
          >
            <Bell className="w-5 h-5 text-primary/80 group-hover:text-primary transition-colors" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isNotificationsOpen && (
          <CustomDrawer title="Уведомления" onClose={handleCloseDrawer}>
            <Notifications />
          </CustomDrawer>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
