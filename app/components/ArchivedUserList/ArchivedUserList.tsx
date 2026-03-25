import Image from "next/image";
import { Trophy, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArchivedParticipant, Profile } from "@prisma/client";

interface IArchivedParticipantExtended extends ArchivedParticipant {
  profile: Profile;
}

const ArchivedUserList = ({
  participants,
}: {
  participants: IArchivedParticipantExtended[];
}) => {
  if (!participants?.length) {
    return (
      <div className="text-center py-10 border border-dashed rounded-xl text-muted-foreground">
        Список участников пуст
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {participants.map((participant) => (
        <div
          key={participant.id}
          className={cn(
            "flex items-center gap-4 p-3 rounded-xl border transition-all",
            participant.is_winner
              ? "bg-primary/5 border-primary/30 shadow-sm"
              : "bg-card border-border hover:border-border/80",
          )}
        >
          {/* Аватар */}
          <div className="relative">
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-background bg-muted">
              {participant.profile.image_url ? (
                <Image
                  src={participant.profile.image_url}
                  alt={participant.profile.full_name || "User"}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            {participant.is_winner && (
              <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1 shadow-lg border border-background">
                <Trophy className="h-3 w-3 text-black" />
              </div>
            )}
          </div>

          {/* Инфо */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "font-semibold truncate",
                  participant.is_winner ? "text-primary" : "text-foreground",
                )}
              >
                {participant.profile.full_name || "Аноним"}
              </span>
            </div>

            {/* Команда (если есть) */}
            {participant.team_name ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <Users className="h-3 w-3" />
                <span className="truncate">
                  Команда: {participant.team_name}
                </span>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground mt-0.5">
                Индивидуальное участие
              </div>
            )}
          </div>

          {/* Метка победителя */}
          {participant.is_winner && (
            <div className="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
              Winner
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ArchivedUserList;
