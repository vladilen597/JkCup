import { ChangeEvent, SubmitEvent, useEffect, useState } from "react";
import Notification from "./Notification/Notification";
import { INotification } from "@/app/lib/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import { Loader2, Plus } from "lucide-react";
import CustomButton, {
  BUTTON_STYLES,
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";
import CustomInput from "../Shared/CustomInput/CustomInput";
import { useAppSelector } from "@/app/utils/store/hooks";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
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
  const { user: currentUser } = useAppSelector((state) => state.user);

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

  const handleLoadNotifications = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/notifications");
      setNotifications(data);
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
      setNotifications((prevState) => [data, ...prevState]);
      handleCloseModal();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id),
    );
  };

  useEffect(() => {
    handleLoadNotifications();
  }, []);

  if (isLoading) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  return (
    <section className="overflow-y-auto h-[90vh] p-6 pt-0">
      {!isNotificationAddOpen && currentUser.role === "superadmin" && (
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
              className="mt-1 w-full p-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
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
      {notifications.length ? (
        <ul className="mt-2 space-y-2">
          {notifications?.map((notification) => (
            <Notification
              key={notification.id}
              {...notification}
              onDeleteClick={handleDeleteNotification}
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
