import { cn } from "@/lib/utils";

interface ITitleProps {
  title: string;
  className?: string;
}

const Title = ({ title, className }: ITitleProps) => {
  return (
    <h1
      className={cn(
        "text-4xl md:text-5xl font-black tracking-tight",
        className,
      )}
    >
      {title}
    </h1>
  );
};

export default Title;
