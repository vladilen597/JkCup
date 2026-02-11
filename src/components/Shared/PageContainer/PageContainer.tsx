import type { ReactNode } from "react";

const PageContainer = ({ children }: { children: ReactNode }) => {
  return <main className="max-w-4xl mx-auto">{children}</main>;
};

export default PageContainer;
