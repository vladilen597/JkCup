import { ReactNode } from "react";
import Header from "../components/Shared/Header/Header";

type Props = {
  children: ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="font-inter">
      <Header />
      {children}
    </div>
  );
};

export default layout;
