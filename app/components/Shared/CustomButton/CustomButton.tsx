import { Loader2 } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export enum BUTTON_TYPES {
  DEFAULT = "DEFAULT",
  CANCEL = "CANCEL",
  DANGER = "DANGER",
}

interface ICustomButtonProps {
  label?: string;
  type?: "button" | "submit";
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  disabled?: boolean;
  buttonType?: BUTTON_TYPES;
  onClick?: () => void;
}

const CustomButton = ({
  label,
  type = "button",
  isLoading,
  icon,
  iconPosition = "left",
  className,
  disabled,
  buttonType,
  onClick,
}: ICustomButtonProps) => {
  return (
    <button
      type={type}
      className={cn(
        "flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors cursor-pointer text-sm font-semibold",
        buttonType === BUTTON_TYPES.CANCEL &&
          "bg-muted text-muted-foreground hover:bg-muted/80",
        buttonType === BUTTON_TYPES.DANGER &&
          "bg-red-600 text-white hover:bg-red-700",
        className,
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {iconPosition === "left" && icon}
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : ""}
      {label}
      {iconPosition === "right" && icon}
    </button>
  );
};

export default CustomButton;
