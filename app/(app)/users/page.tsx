import UsersPage from "@/app/components/Pages/UsersPage/UsersPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JkCup | Пользователи",
};

const page = () => {
  return <UsersPage />;
};

export default page;
