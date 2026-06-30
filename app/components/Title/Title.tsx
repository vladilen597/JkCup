import { cn } from "@/lib/utils";
import CustomSkeleton from "../Shared/CustomSkeleton/CustomSkeleton";

interface ITitleProps {
  title: string;
  className?: string;
  isLoading?: boolean;
}

const Title = ({ title, className, isLoading }: ITitleProps) => {
  if (isLoading) {
    return <CustomSkeleton width={200} height={60} />;
  }
  return (
    <h1 className={cn("text-2xl md:text-5xl tracking-wide", className)}>
      {title}
    </h1>
  );
};

export default Title;
