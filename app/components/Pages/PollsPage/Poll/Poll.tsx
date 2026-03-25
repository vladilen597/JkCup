import { IGame, IGlobalPoll, IPollOption } from "@/app/lib/types";
import { useAppSelector } from "@/app/utils/store/hooks";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, LockIcon, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const Poll = ({
  id,
  title,
  ends_at,
  options,
  votes,
  is_active,
  onDelete,
  onCloseClick,
}: IGlobalPoll & {
  onDelete?: () => void;
  onCloseClick?: (id: string) => void;
}) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { currentUser } = useAppSelector((user) => user.user);
  const isSuperAdmin = currentUser?.role === "superadmin";

  const totalVotes = votes?.length;

  const stats = votes?.reduce((acc: Record<string, number>, curr) => {
    acc[curr.game_id] = (acc[curr.game_id] || 0) + 1;
    return acc;
  }, {});

  const handleDeletePoll = async () => {
    setIsDeleteLoading(true);
    try {
      await axios.delete(`/api/admin/polls/${id}`);
      onDelete();
      toast.success("Голосование удалено");
    } catch (error) {
      toast.error("Ошибка при удалении");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl relative overflow-hidden">
        <div className="flex justify-between items-start mb-8">
          <div>
            {is_active && (
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[10px] text-primary uppercase font-black tracking-widest">
                  Live Poll
                </span>
              </div>
            )}
            <h2 className="text-3xl font-bold">{title}</h2>
          </div>

          {isSuperAdmin &&
            (is_active ? (
              <button
                title="Закрыть голосование"
                type="button"
                onClick={() => onCloseClick(id)}
                className="p-3 hover:bg-zinc-500/10 text-zinc-600 hover:text-zinc-200 rounded-2xl transition-all cursor-pointer"
              >
                <LockIcon className="w-6 h-6" />
              </button>
            ) : (
              <button
                title="Удалить голосование"
                onClick={handleDeletePoll}
                type="button"
                className="p-3 hover:bg-red-500/10 text-zinc-600 hover:text-red-500 rounded-2xl transition-all cursor-pointer"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            ))}
        </div>

        <div className="flex flex-wrap gap-6 mb-10 text-zinc-400 text-sm">
          <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-full">
            <Clock className="w-4 h-4 text-primary" />
            До: {new Date(ends_at).toLocaleString()}
          </div>
          <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-full">
            <Users className="w-4 h-4 text-primary" />
            Всего голосов: {votes?.length}
          </div>
        </div>

        <div className="space-y-6">
          {options?.map((option: IPollOption) => {
            const votes = stats[option.game.id] || 0;
            const percent = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

            return (
              <div key={option.id} className="relative">
                <div className="flex justify-between items-center mb-2 px-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={option.game.image_url}
                      className="w-8 h-8 rounded-lg object-cover"
                      alt=""
                    />
                    <span className="font-semibold text-zinc-200">
                      {option.game.name}
                    </span>
                  </div>
                  <span className="font-mono text-sm text-zinc-400">
                    {Math.round(percent)}% ({votes})
                  </span>
                </div>
                <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Poll;
