import GamesPage from "@/app/components/Pages/GamesPage/GamesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JkCup | Игры",
};

const page = () => {
  return <GamesPage />;
};

export default page;
