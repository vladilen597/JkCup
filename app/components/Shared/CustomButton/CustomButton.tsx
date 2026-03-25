import { Loader2 } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export enum BUTTON_TYPES {
  DEFAULT = "DEFAULT",
  CANCEL = "CANCEL",
  DANGER = "DANGER",
}

export enum BUTTON_STYLES {
  DEFAULT = "DEFAULT",
  OUTLINE = "OUTLINE",
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
  buttonStyle?: BUTTON_STYLES;
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
  buttonStyle,
  onClick,
}: ICustomButtonProps) => {
  return (
    <button
      type={type}
      className={cn(
        "flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors cursor-pointer text-sm font-semibold",
        buttonType === BUTTON_TYPES.CANCEL &&
          "bg-muted text-muted-foreground hover:bg-muted/80",
        buttonType === BUTTON_TYPES.DANGER &&
          "bg-red-700/60 text-white hover:bg-red-700",
        buttonStyle === BUTTON_STYLES.OUTLINE &&
          "border border-primary! text-primary hover:bg-primary/40 bg-primary/10",
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
