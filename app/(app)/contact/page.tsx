import ContactPage from "@/app/components/Pages/ContactPage/ContactPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JkCup | Обратная связь",
};

const page = () => {
  return <ContactPage />;
};

export default page;
