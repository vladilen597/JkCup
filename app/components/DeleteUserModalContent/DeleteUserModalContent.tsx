import { useState } from "react";
import CustomButton, {
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";
import { Trash2 } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
// import admin from "firebase-admin";
import axios from "axios";

interface IDeleteUserModalContentProps {
  userId: string;
  onClose: () => void;
  onSubmit: () => void;
}

const DeleteUserModalContent = ({
  userId,
  onClose,
  onSubmit,
}: IDeleteUserModalContentProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteUser = async () => {
    setIsLoading(true);
    try {
      const data = await axios.delete("/api/users", {
        params: {
          userId,
        },
      });
      if (data.status === 200) {
        onClose();
        onSubmit();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3 className="text-xl font-bold mb-4 text-red-500 flex items-center gap-2">
        <Trash2 className="h-5 w-5" />
        Удалить пользователя?
      </h3>
      <p className="text-muted-foreground mb-6">
        Это действие нельзя отменить. Пользователю придется совершить вход
        заново.
      </p>
      <div className="flex justify-end gap-3">
        <CustomButton
          label="Отмена"
          buttonType={BUTTON_TYPES.CANCEL}
          onClick={onClose}
        />
        <CustomButton
          label="Удалить"
          isLoading={isLoading}
          buttonType={BUTTON_TYPES.DANGER}
          onClick={handleDeleteUser}
        />
      </div>
    </>
  );
};

export default DeleteUserModalContent;
