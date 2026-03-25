import { X, Check, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { useAppSelector } from "@/app/utils/store/hooks";
import CustomButton, {
  BUTTON_STYLES,
} from "../../Shared/CustomButton/CustomButton";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { INotification } from "@/app/lib/types";

interface NotificationProps extends INotification {
  isSuperAdmin?: boolean;
  is_read: boolean;
  onDeleteClick: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

const typeConfig = {
  info: {
    icon: Info,
    classes: "text-primary",
    label: "Info",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  warning: {
    icon: AlertTriangle,
    classes: "text-amber-500",
    label: "Warning",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  error: {
    icon: AlertCircle,
    classes: "text-red-500",
    label: "Error",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
  },
  success: {
    icon: Check,
    classes: "text-emerald-500",
    label: "Success",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

const Notification = ({
  id,
  title,
  text,
  created_at,
  is_read,
  type,
  onDeleteClick,
  onMarkAsRead,
}: NotificationProps) => {
  const { currentUser } = useAppSelector((state) => state.user);
  const isSuperAdmin = currentUser?.role === "superadmin";

  const { icon: TypeIcon, classes: typeClasses } = typeConfig[type];

  return (
    <div
      className={cn(
        "group relative rounded-lg border p-4 transition-all duration-200",
        !is_read
          ? "border-primary/50 bg-primary/5 shadow-sm"
          : "border-border bg-card opacity-80",
      )}
    >
      {!is_read && (
        <span className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-primary" />
      )}

      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5 shrink-0", typeClasses)}>
          <TypeIcon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={cn(
                "text-sm leading-tight",
                !is_read
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted-foreground",
              )}
            >
              {title}
            </h4>
          </div>

          <p
            className={cn(
              "text-sm leading-relaxed",
              !is_read ? "text-foreground/80" : "text-muted-foreground",
            )}
          >
            {text}
          </p>

          <div className="flex items-end justify-between pt-1">
            <time className="text-xs text-muted-foreground tabular-nums">
              {format(new Date(created_at), "dd.MM.yyyy HH:mm")}
            </time>

            <div className="flex items-center gap-1">
              {!is_read && (
                <CustomButton
                  label="Прочитать"
                  buttonStyle={BUTTON_STYLES.OUTLINE}
                  className="h-7 px-2 text-xs"
                  onClick={() => onMarkAsRead(id)}
                  icon={<Check className="h-3.5 w-3.5" />}
                />
              )}

              {isSuperAdmin && (
                <CustomButton
                  buttonStyle={BUTTON_STYLES.OUTLINE}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => onDeleteClick(id)}
                  icon={<X className="h-3.5 w-3.5" />}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
