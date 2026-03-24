import UserItemPage from "@/app/components/Pages/UserItemPage/UserItemPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JkCup | Профиль",
};

const page = ({ children }: { children: React.ReactNode }) => {
  return <UserItemPage>{children}</UserItemPage>;
};

export default page;
