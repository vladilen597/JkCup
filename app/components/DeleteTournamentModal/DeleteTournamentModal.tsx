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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-xl p-6 w-full max-w-md border border-border"
      >
        <h3 className="text-xl font-bold mb-4 text-red-500 flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Удалить турнир?
        </h3>
        <p className="text-muted-foreground mb-6">
          Это действие нельзя отменить. Все данные турнира будут удалены
          навсегда.
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
      </motion.div>
    </div>
  );
};

export default DeleteTournamentModal;
