import TournamentItemPage from "@/app/components/Pages/TournamentItemPage/TournamentItemPage";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `JkCup | Турнир ${id}`,
  };
}

const page = () => {
  return <TournamentItemPage />;
};

export default page;
