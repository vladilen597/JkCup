import { deleteGame } from "@/app/utils/store/gamesSlice";
import { useAppDispatch } from "@/app/utils/store/hooks";
import CustomButton, {
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";

interface IDeleteUserModalContentProps {
  gameId: string;
  onClose: () => void;
}

const DeleteGameModalContent = ({
  gameId,
  onClose,
}: IDeleteUserModalContentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleDeleteGame = async () => {
    setIsLoading(true);

    try {
      await axios.delete("/api/games", {
        params: {
          id: gameId,
        },
      });
      dispatch(deleteGame(gameId));
      onClose();
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
        Удалить игру?
      </h3>
      <p className="text-muted-foreground mb-6">
        Это действие нельзя отменить. Игра будет удалена
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
          onClick={handleDeleteGame}
        />
      </div>
    </>
  );
};

export default DeleteGameModalContent;
