import ArchivePage from "@/app/components/Pages/ArchivePage/ArchivePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JkCup | Архив",
};

const page = () => {
  return <ArchivePage />;
};

export default page;
