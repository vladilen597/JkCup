import { motion } from "motion/react";
import { Loader2, Trash2 } from "lucide-react";

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
        <button
          onClick={onClose}
          className="px-5 py-2.5 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80"
        >
          Отмена
        </button>
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Удалить
        </button>
      </div>
    </>
  );
};

export default DeleteTournamentModal;
