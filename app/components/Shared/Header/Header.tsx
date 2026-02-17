"use client";

import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import { useGoogleSignIn } from "@/app/utils/useGoogleSignIn";
import { Trophy, ChevronDown, Users } from "lucide-react";
import { IUser, setUser } from "@/app/utils/store/userSlice";
import { AnimatePresence } from "motion/react";
import Discord from "../../Icons/Discord";
import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const { signIn } = useGoogleSignIn();
  const dispatch = useAppDispatch();

  const handleCloseProfileDropdown = () => {
    setIsProfileOpen(false);
  };

  const handleLogOut = () => {
    dispatch(
      setUser({
        uid: "",
        displayName: "Anonymous",
        photoUrl: "",
        email: "",
        role: "user",
      }),
    );
    setIsProfileOpen(false);
  };

  const handleGoogleSignIn = () => {
    signIn();
  };

  const handleGetUser = async () => {
    try {
      if (user.uid) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = (await getDoc(userRef)).data();

        if (userSnap) {
          dispatch(setUser(userSnap as IUser));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/tournaments" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center neon-border group-hover:neon-glow transition-shadow duration-300">
              <Trophy className="h-4 w-4 text-primary" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-foreground">
              Турниры
            </span>
          </Link>
          <Link href="/users" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center neon-border group-hover:neon-glow transition-shadow duration-300">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-foreground">
              Пользователи
            </span>
          </Link>
          <Link
            href="https://discord.gg/Xat3sm6wC4"
            className="flex items-center gap-2 group"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center neon-border group-hover:neon-glow transition-shadow duration-300">
              <Discord fill="#19e6d4" className="h-4 w-4 text-primary" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-foreground">
              Discord
            </span>
          </Link>
        </div>

        {user.uid ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen((p) => !p)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <span className="text-sm font-medium text-foreground">
                {user.displayName}
              </span>
              <img
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
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors neon-glow cursor-pointer"
            onClick={handleGoogleSignIn}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.31-.98 2.42-2.07 3.16v2.63h3.35c1.96-1.81 3.09-4.46 3.09-7.99z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.35-2.63c-.98.66-2.23 1.06-3.93 1.06-3.02 0-5.58-2.04-6.49-4.79H.96v2.67C2.77 20.39 6.62 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.51 14.21c-.23-.66-.36-1.37-.36-2.21s.13-1.55.36-2.21V7.34H.96C.35 8.85 0 10.39 0 12s.35 3.15.96 4.66l4.55-2.45z"
              />
              <path
                fill="currentColor"
                d="M12 4.98c1.64 0 3.11.56 4.27 1.66l3.19-3.19C17.46 1.01 14.97 0 12 0 6.62 0 2.77 2.61.96 6.34l4.55 2.45C6.42 6.02 8.98 4.98 12 4.98z"
              />
            </svg>
            Войти
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
