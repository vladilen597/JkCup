import TournamentsPage from "@/app/components/Pages/TournamentsPage/TournamentsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JkCup | Турниры",
};

const page = () => {
  return <TournamentsPage />;
};

export default page;
