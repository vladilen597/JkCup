import { motion } from "motion/react";
import { Loader2, Trash2 } from "lucide-react";
import CustomButton, {
  BUTTON_TYPES,
} from "../Shared/CustomButton/CustomButton";

interface IDeleteTournamentModalProps {
  isLoading: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

const DeleteTournamentModal = ({
  isLoading,
  onSubmit,
  onClose,
}: IDeleteTournamentModalProps) => {
  return (
    <>
      <h3 className="text-xl font-bold mb-4 text-red-500 flex items-center gap-2">
        <Trash2 className="h-5 w-5" />
        Удалить турнир?
      </h3>
      <p className="text-muted-foreground mb-6">
        Это действие нельзя отменить. Все данные турнира будут удалены навсегда.
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
          onClick={onSubmit}
        />
      </div>
    </>
  );
};

export default DeleteTournamentModal;
