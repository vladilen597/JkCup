import { IMatch } from "@/app/lib/types";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { Loader2, Trophy, X } from "lucide-react";
import ParticipantInfo from "../ParticipantInfo/ParticipantInfo";
import { useState } from "react";

interface DroppableSlotProps {
  match: IMatch;
  roundId: string;
  slot: 1 | 2;
  isAdmin: boolean;
  label: string;
  onRemove: (
    matchId: string,
    participantRecordId: string,
    roundId: string,
  ) => void;
  onWinnerClick: (
    matchId: string,
    participantId: string,
    roundId: string,
  ) => void;
}

const DroppableSlot = ({
  match,
  roundId,
  slot,
  isAdmin,
  label,
  onRemove,
  onWinnerClick,
}: DroppableSlotProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClickDelete = async () => {
    setIsLoading(true);
    await onRemove(match.id, record!.id, roundId);
    setIsLoading(false);
  };
  const record = match.participants?.find((p) => p.slot === slot);

  const participantData = record?.profile || record?.team;
  const participantId = record?.profile_id || record?.team_id;

  const isWinner =
    !!match.winner_id && !!participantId && match.winner_id === participantId;

  const { isOver, setNodeRef } = useDroppable({
    id: `${match.id}|${slot}|${roundId}`,
    disabled: !isAdmin,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative p-2 min-h-11 flex items-center justify-between transition-colors",
        isOver && isAdmin ? "bg-primary/20" : "bg-transparent",
        isWinner
          ? "bg-green-500/10 shadow-[inset_0_0_10px_rgba(34,197,94,0.1)]"
          : "",
      )}
    >
      {participantData ? (
        <div className="flex items-center justify-between w-full group/player">
          <ParticipantInfo data={participantData} />

          {isAdmin && (
            <div className="flex gap-1 opacity-0 group-hover/player:opacity-100 transition-opacity">
              <button
                onClick={() => onWinnerClick(match.id, participantId!, roundId)}
              >
                <Trophy className="w-3.5 h-3.5 hover:text-green-400" />
              </button>
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <button onClick={handleClickDelete}>
                  <X className="w-3.5 h-3.5 hover:text-red-400" />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <span className="text-[10px] text-zinc-600 uppercase font-bold px-2">
          {label}
        </span>
      )}
    </div>
  );
};

export default DroppableSlot;
