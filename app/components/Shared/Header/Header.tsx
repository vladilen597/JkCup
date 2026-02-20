"use client";

import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import { useGoogleSignIn } from "@/app/utils/useGoogleSignIn";
import { Trophy, ChevronDown, Users, Archive } from "lucide-react";
import { IUser, setUser } from "@/app/utils/store/userSlice";
import { AnimatePresence } from "motion/react";
import Discord from "../../Icons/Discord";
import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import CustomButton from "../CustomButton/CustomButton";
import Google from "../../Icons/Google";

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
        discord: "",
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
            href="https://discord.gg/S6QMcETh4d"
            className="flex items-center gap-2 group"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center neon-border group-hover:neon-glow transition-shadow duration-300">
              <Discord fill="#19e6d4" className="h-4 w-4 text-primary" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-foreground">
              Discord
            </span>
          </Link>
          <Link href="/archive" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center neon-border group-hover:neon-glow transition-shadow duration-300">
              <Archive className="h-4 w-4 text-primary" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-foreground">
              Архив
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
          <CustomButton
            label="Войти"
            icon={<Google />}
            onClick={handleGoogleSignIn}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
