import { cn } from "@/lib/utils";

interface ITitleProps {
  title: string;
  className?: string;
}

const Title = ({ title, className }: ITitleProps) => {
  return (
    <h1 className={cn("text-2xl md:text-5xl tracking-wide", className)}>
      {title}
    </h1>
  );
};

export default Title;
