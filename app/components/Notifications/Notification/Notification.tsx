import { INotification } from "@/app/lib/types";
import { useAppSelector } from "@/app/utils/store/hooks";
import axios from "axios";
import { format } from "date-fns";
import { X } from "lucide-react";

const Notification = ({
  id,
  title,
  text,
  created_at,
  onDeleteClick,
}: INotification & { onDeleteClick: (id: string) => void }) => {
  const { user: currentUser } = useAppSelector((state) => state.user);

  const handleDeleteNotification = async () => {
    try {
      await axios.delete("/api/notifications", {
        params: {
          id,
        },
      });
      onDeleteClick(id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <li className="relative border border-neon/50! p-3 rounded-lg">
      {currentUser.role === "superadmin" && (
        <button
          className="absolute right-1 top-1"
          type="button"
          onClick={handleDeleteNotification}
        >
          <X className="text-neutral-400" />
        </button>
      )}
      <h3 className="text-lg">{title}</h3>
      <p className="mt-2 text-sm text-neutral-300">{text}</p>
      <span className="block text-right mt-2 text-xs text-neutral-500">
        {format(created_at, "dd.MM.yyyy HH:mm")}
      </span>
    </li>
  );
};

export default Notification;
