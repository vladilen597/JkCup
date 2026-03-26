import CustomInput from "../Shared/CustomInput/CustomInput";
import { SetStateAction, SubmitEvent, useEffect, useState } from "react";
import { useAppSelector } from "@/app/utils/store/hooks";
import Notification from "./Notification/Notification";
import { IUserNotification } from "@/app/lib/types";
import CustomButton, {
  BUTTON_STYLES,
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";
import { Loader2, Plus } from "lucide-react";
import axios from "axios";

const Notifications = ({
  handleUpdateUnreadAmount,
}: {
  handleUpdateUnreadAmount: (state: SetStateAction<number>) => void;
}) => {
  const [userNotifications, setUserNotifications] = useState<
    IUserNotification[]
  >([]);
  const [isNotificationAddOpen, setIsNotificationAddOpen] = useState(false);
  const [notificationData, setNotificationData] = useState<{
    title: string;
    text: string;
  }>({
    title: "",
    text: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const { currentUser } = useAppSelector((state) => state.user);

  const handleOpenModal = () => {
    setIsNotificationAddOpen(true);
  };

  const handleCloseModal = () => {
    setIsNotificationAddOpen(false);
  };

  const handleChangeInput = <
    T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  >(
    e: React.ChangeEvent<T>,
  ) => {
    setNotificationData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLoadUserNotifications = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/api/users/${currentUser?.id}/notifications`,
      );
      setUserNotifications(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNewNotification = async (
    e: SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      const { data } = await axios.post("/api/notifications", notificationData);
      handleUpdateUnreadAmount((prevState) => prevState + 1);
      setUserNotifications((prevState) => [data, ...prevState]);
      handleCloseModal();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleMarkAsRead = async (userNotificationId: string) => {
    try {
      await axios.patch(`/api/users/${currentUser?.id}/notifications/read`, {
        id: userNotificationId,
      });
      setUserNotifications((prev) =>
        prev.map((n) =>
          n.id === userNotificationId ? { ...n, is_read: true } : n,
        ),
      );
      handleUpdateUnreadAmount((prevState) => prevState - 1);
    } catch (error) {
      console.error("Ошибка при обновлении статуса", error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await axios.delete(`/api/notifications?id=${notificationId}`);

      handleUpdateUnreadAmount((prevState) => prevState - 1);
      setUserNotifications((prevState) =>
        prevState.filter((un) => un.notification.id !== notificationId),
      );
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
  };

  useEffect(() => {
    handleLoadUserNotifications();
  }, []);

  if (isLoading) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  return (
    <section className="overflow-y-auto h-[90vh] p-6 pt-0">
      {!isNotificationAddOpen && currentUser?.role === "superadmin" && (
        <CustomButton
          className="ml-auto mr-0"
          buttonStyle={BUTTON_STYLES.OUTLINE}
          icon={<Plus className="w-4 h-4" />}
          label="Добавить"
          onClick={handleOpenModal}
        />
      )}
      {isNotificationAddOpen && (
        <form className="mb-8" onSubmit={handleSubmitNewNotification}>
          <CustomInput
            name="title"
            label="Заголовок"
            required
            value={notificationData.title}
            onChange={handleChangeInput}
          />
          <label className="block mt-2">
            <span className="text-sm font-medium">Описание</span>
            <textarea
              required
              className="mt-1 w-full p-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              name="text"
              onChange={handleChangeInput}
            ></textarea>
          </label>
          <div className="flex items-center gap-2">
            <CustomButton
              label="Сохранить"
              type="submit"
              isLoading={isSubmitLoading}
            />
            <CustomButton
              label="Отмена"
              buttonType={BUTTON_TYPES.CANCEL}
              onClick={handleCloseModal}
            />
          </div>
        </form>
      )}
      {userNotifications.length ? (
        <ul className="mt-2 space-y-2">
          {userNotifications.map((un) => (
            <Notification
              key={un.id}
              id={un.id}
              is_read={un.is_read}
              {...un.notification}
              onMarkAsRead={() => handleMarkAsRead(un.id)}
              onDeleteClick={() => handleDeleteNotification(un.notification.id)}
            />
          ))}
        </ul>
      ) : (
        <p className="block mx-auto text-sm text-neutral-400">
          Нет уведомлений
        </p>
      )}
    </section>
  );
};

export default Notifications;
