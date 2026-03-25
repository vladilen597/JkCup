import PollsPage from "@/app/components/Pages/PollsPage/PollsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JkCup | Голосования",
};

const page = () => {
  return <PollsPage />;
};

export default page;
