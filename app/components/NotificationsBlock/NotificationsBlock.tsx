import CustomDrawer from "../Shared/CustomDrawer/CustomDrawer";
import Notifications from "../Notifications/Notifications";
import { AnimatePresence } from "motion/react";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/app/utils/store/hooks";
import axios from "axios";

const NotificationsBlock = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useAppSelector((state) => state.user);

  const fetchUnreadCount = async () => {
    if (!currentUser?.id) return;
    try {
      const { data } = await axios.get(
        `/api/users/${currentUser?.id}/notifications/check`,
      );
      setUnreadCount(data.count);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 120000);
    return () => clearInterval(interval);
  }, [currentUser?.id]);

  const handleCloseDrawer = () => {
    setIsNotificationsOpen(false);
  };

  const handleOpenDrawer = () => {
    setIsNotificationsOpen(true);
  };

  return (
    <div className="flex items-center">
      <div className="relative flex items-center">
        <button
          className="cursor-pointer group"
          type="button"
          onClick={handleOpenDrawer}
        >
          <Bell className="w-5 h-5 text-primary/80 group-hover:text-primary transition-colors" />
          {unreadCount > 0 && (
            <>
              <span className="absolute z-10 flex items-center justify-center bg-red-600 text-white rounded-full -top-2 -right-1 bottom-full text-xs h-4 min-w-4">
                {unreadCount}
              </span>
              <span className="absolute animate-ping bg-red-600 rounded-full -top-2 -right-1 bottom-full text-xs h-4 min-w-4"></span>
            </>
          )}
        </button>
      </div>
      <AnimatePresence>
        {isNotificationsOpen && (
          <CustomDrawer title="Уведомления" onClose={handleCloseDrawer}>
            <Notifications handleUpdateUnreadAmount={setUnreadCount} />
          </CustomDrawer>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsBlock;
