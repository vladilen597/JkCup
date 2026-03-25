import FAQPage from "@/app/components/Pages/FaqPage/FaqPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JkCup | FAQ",
};

const page = () => {
  return <FAQPage />;
};

export default page;
