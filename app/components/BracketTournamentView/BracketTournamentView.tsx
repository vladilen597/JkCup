"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { Plus, Trash2, Users, GripVertical, X, Trophy } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
} from "@dnd-kit/core";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import {
  updateTournament,
  ITournament,
  ITeam,
} from "@/app/utils/store/tournamentsSlice";
import UserInfoBlock from "../Shared/UserInfoBlock/UserInfoBlock";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { doc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/app/utils/firebase";
import handleGetUsersByIds from "@/app/utils/requests/getUsersByIds";
import ChangeInfoInput from "./ChangeInfoInput/ChangeInfoInput";
import { cn } from "@/lib/utils";
import Discord from "../Icons/Discord";
import Steam from "../Icons/Steam";
import { IUser } from "@/app/lib/types";

interface BracketProps {
  tournament: ITournament;
}

const MatchBox = ({ match, isAdmin, onRemoveMatch, children }: any) => {
  useXarrow();
  return (
    <div className="relative flex flex-col items-center group/match my-4">
      {isAdmin && (
        <button
          onClick={onRemoveMatch}
          className="absolute -top-6 right-0 opacity-0 group-hover/match:opacity-100 p-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded transition-all z-30 cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
      <div
        id={match.id}
        className="relative w-64 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg z-20"
      >
        {children}
      </div>
    </div>
  );
};

const DroppableSlot = ({
  winnerId,
  id,
  participant,
  label,
  isAdmin,
  onRemove,
  isPlaceholder,
  onWinnerClick,
}: any) => {
  const { isOver, setNodeRef } = useDroppable({ id, disabled: !isAdmin });

  const { user: currentUser } = useAppSelector((state) => state.user);
  const isCurrentUser = currentUser.id === participant?.id;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-full relative p-2 min-h-13 border-b border-zinc-800/50 flex items-center justify-between transition-colors duration-200",
        isOver && isAdmin ? "bg-primary/20" : "bg-transparent",
        participant?.uid && participant?.uid === winnerId
          ? "bg-green-400/20"
          : "",
        isPlaceholder && "border-b-0",
      )}
    >
      {participant ? (
        <div className="flex items-center justify-between w-full group/player">
          <div className="flex items-center gap-2">
            {participant.type === "team" ? (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-400" />
                <div>
                  <div className="text-sm font-medium">
                    {participant.name || "Команда"}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {participant.usersIds?.length || 0} игроков
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-foreground truncate leading-5 text-sm">
                  {participant.displayName}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs leading-0 text-orange-400">
                      Вы
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  {participant.discord && (
                    <p className="flex shrink-0 items-center gap-1 font-semibold text-xs truncate leading-5 text-neutral-400">
                      <Discord className="w-4 h-4" /> {participant.discord}
                    </p>
                  )}
                  {!!participant.steam_link &&
                    !!participant.steamDisplayName && (
                      <p className="flex shrink-0 items-center gap-1 font-semibold text-xs truncate leading-5 text-neutral-400 hover:text-white transition-colors">
                        <Steam className="w-4 h-4" />{" "}
                        <span className="underline" rel="noopener noreferrer">
                          {participant.steamDisplayName}
                        </span>
                      </p>
                    )}
                </div>
              </div>
            )}
          </div>
          {isAdmin && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onWinnerClick();
                }}
                className="p-1 opacity-0 group-hover/player:opacity-100 hover:bg-green-500/20 rounded text-zinc-500 hover:text-green-400 transition-all cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-1 opacity-0 group-hover/player:opacity-100 hover:bg-red-500/20 rounded text-zinc-500 hover:text-red-400 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      ) : (
        <span className="text-[10px] text-zinc-600 uppercase font-medium px-2">
          {label}
        </span>
      )}
    </div>
  );
};

const DraggableUser = ({ user }: { user: any }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: user.uid,
    data: { ...user, type: "player" },
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex items-center gap-2 p-2 bg-zinc-800 border border-zinc-700 rounded-lg cursor-grab hover:border-primary/50 transition-colors"
    >
      <GripVertical className="w-4 h-4 text-zinc-500" />
      <UserInfoBlock {...user} />
    </div>
  );
};

const DraggableTeam = ({ team }: { team: ITeam }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: team.uid,
    data: { ...team, type: "team" },
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex items-center gap-2 p-2 bg-zinc-800 border border-zinc-700 rounded-lg cursor-grab hover:border-primary/50 transition-colors"
    >
      <GripVertical className="w-4 h-4 text-zinc-500" />
      <div>
        <h3 className="font-semibold">{team.name || `Team ${team.uid}`}</h3>
        <div className="text-xs text-zinc-500">
          {team.usersIds.length} Игроков
        </div>
      </div>
    </div>
  );
};

const BracketTournamentView = ({ tournament }: BracketProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.user);
  const [users, setUsers] = useState<IUser[]>([]);
  const [activeBlock, setActiveBlock] = useState<any>(null);

  const isAdmin = useMemo(
    () =>
      !!(currentUser?.role === "admin" || currentUser?.role === "superadmin"),
    [currentUser?.role],
  );

  const isTeamMode = tournament.type.value === "team";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleScroll = () => {
    useXarrow();
  };

  const rounds = useMemo(
    () =>
      Array.isArray(tournament?.bracket?.rounds)
        ? tournament.bracket.rounds
        : [],
    [tournament?.bracket?.rounds],
  );

  const handleLoadUsers = async () => {
    try {
      const users = await handleGetUsersByIds(tournament.usersIds);
      setUsers(users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isTeamMode) {
      handleLoadUsers();
    }
  }, [isTeamMode]);

  const syncRounds = async (updatedRounds: any[]) => {
    const updatedBracket = { ...tournament.bracket, rounds: updatedRounds };
    try {
      await updateDoc(doc(db, "tournaments", tournament.id), {
        bracket: updatedBracket,
      });
      dispatch(updateTournament({ ...tournament, bracket: updatedBracket }));
    } catch (err) {
      console.error("Sync failed:", err);
    }
  };

  const handleAddRound = () =>
    syncRounds([...rounds, { id: uuidv4(), matches: [] }]);

  const handleRemoveRound = (id: string) =>
    syncRounds(rounds.filter((r: any) => r.id !== id));

  const handleAddMatch = (rIdx: number) => {
    const updated = JSON.parse(JSON.stringify(rounds));
    updated[rIdx].matches.push({
      id: uuidv4(),
      participants: [],
    });
    syncRounds(updated);
  };

  const handleRemoveMatch = (rId: string, mId: string) => {
    const updated = rounds.map((r: any) => {
      if (r.id !== rId) return r;
      return { ...r, matches: r.matches.filter((m: any) => m && m.id !== mId) };
    });
    syncRounds(updated);
  };

  const handleSetWinner = (rId: string, mId: string, participantId: string) => {
    const updated = rounds.map((r: any) => {
      if (r.id !== rId) return r;
      return {
        ...r,
        matches: r.matches.map((m: any) => {
          if (!m || m.id !== mId) return m;
          return {
            ...m,
            winnerId: participantId,
          };
        }),
      };
    });
    syncRounds(updated);
  };

  const handleRemoveParticipantFromMatch = (
    rId: string,
    mId: string,
    participantId: string,
  ) => {
    const updated = rounds.map((r: any) => {
      if (r.id !== rId) return r;
      return {
        ...r,
        matches: r.matches.map((m: any) => {
          if (!m || m.id !== mId) return m;
          return {
            ...m,
            participants: (m.participants || []).filter(
              (p: any) => p.uid !== participantId,
            ),
          };
        }),
      };
    });
    syncRounds(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveBlock(null);
    if (!over || !isAdmin) return;

    const [roundId, matchId] = (over.id as string).split("|");
    const participant = active.data.current as any;

    const round = rounds.find((r: any) => r.id === roundId);
    const match = round?.matches?.find((m: any) => m.id === matchId);

    if (match?.users?.some((p: any) => p.uid === participant.uid)) {
      return;
    }

    const updated = rounds.map((r: any) => {
      if (r.id !== roundId) return r;
      return {
        ...r,
        matches: r.matches.map((m: any) => {
          if (!m || m.id !== matchId) return m;
          return {
            ...m,
            participants: [
              ...(m.participants || []),
              {
                uid: participant.uid,
                full_name: participant.full_name,
                discord: participant.discord,
                steam_link: participant.steam_link,
                steam_display_name: participant.steam_display_name,
              },
            ],
          };
        }),
      };
    });
    syncRounds(updated);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={(e) => setActiveBlock(e.active.data.current)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-10 w-fit">
        {isAdmin && (
          <>
            {isTeamMode ? (
              <ul className="space-y-2">
                {tournament.teams.map((team) => (
                  <li key={team.uid}>
                    <DraggableTeam team={team} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 backdrop-blur-sm mx-4">
                <h4 className="flex items-center gap-2 mb-4 font-bold text-zinc-400 text-sm uppercase tracking-tight">
                  <Users className="w-4 h-4" /> Доступные игроки
                </h4>
                <div className="flex flex-col gap-2 h-full overflow-y-auto">
                  {users.map((u: any) => (
                    <DraggableUser key={u.uid} user={u} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="relative overflow-x-auto pb-20 custom-scrollbar"
        >
          <Xwrapper>
            <div className="inline-flex gap-24 items-stretch min-h-150 p-4">
              {rounds.map((round: any, rIdx: number) => (
                <div
                  key={round.id}
                  className="flex flex-col justify-around gap-4 min-w-65 group/round"
                >
                  <div className="flex justify-between items-center px-1 mb-4">
                    <h3 className="font-bold text-zinc-500 uppercase text-[11px] tracking-widest">
                      {rIdx + 1 === rounds?.length
                        ? "Победитель"
                        : rIdx + 1 === rounds?.length - 1
                          ? "Финал"
                          : rIdx + 1 === rounds?.length - 2
                            ? "Полуфинал"
                            : `Раунд ${rIdx + 1}`}
                    </h3>
                    {isAdmin && (
                      <button
                        onClick={() => handleRemoveRound(round.id)}
                        className="opacity-0 group-hover/round:opacity-100 text-zinc-600 hover:text-red-500 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-around">
                    {round.matches?.map((match: any, mIdx: number) => {
                      const nextRound = rounds[rIdx + 1];
                      const targetMatch =
                        nextRound?.matches?.[Math.floor(mIdx / 2)];

                      return (
                        <React.Fragment key={match.id}>
                          <MatchBox
                            match={match}
                            isAdmin={isAdmin}
                            onRemoveMatch={() =>
                              handleRemoveMatch(round.id, match.id)
                            }
                          >
                            <div className="flex flex-col">
                              {!!match.participants?.length ? (
                                match.participants?.map((p: any) => (
                                  <div key={p.uid}>
                                    <DroppableSlot
                                      key={p.uid}
                                      id={`${round.id}|${match.id}|${p.uid}`}
                                      participant={p}
                                      isAdmin={isAdmin}
                                      winnerId={match.winnerId}
                                      onRemove={() =>
                                        handleRemoveParticipantFromMatch(
                                          round.id,
                                          match.id,
                                          p.uid,
                                        )
                                      }
                                      onWinnerClick={() =>
                                        handleSetWinner(
                                          round.id,
                                          match.id,
                                          p.uid,
                                        )
                                      }
                                    />
                                  </div>
                                ))
                              ) : (
                                <DroppableSlot
                                  id={`${round.id}|${match.id}|placeholder`}
                                  participant={null}
                                  label="Пусто"
                                  isAdmin={isAdmin}
                                  isPlaceholder={true}
                                />
                              )}

                              <ChangeInfoInput
                                roundId={round.id}
                                matchId={match.id}
                                currentValue={match.info || ""}
                                disabled={!isAdmin}
                                onUpdate={(rId, mId, info) => {
                                  const updatedRounds = rounds.map((r: any) =>
                                    r.id === rId
                                      ? {
                                          ...r,
                                          matches: r.matches.map((m: any) =>
                                            m.id === mId ? { ...m, info } : m,
                                          ),
                                        }
                                      : r,
                                  );
                                  syncRounds(updatedRounds);
                                }}
                              />
                            </div>
                          </MatchBox>

                          {targetMatch && (
                            <Xarrow
                              start={match.id}
                              end={targetMatch.id}
                              strokeWidth={2}
                              color="#3f3f46"
                              path="grid"
                              headSize={0}
                              startAnchor="right"
                              endAnchor="left"
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleAddMatch(rIdx)}
                      className="mt-4 p-2 border border-dashed border-zinc-800 rounded-lg text-zinc-600 hover:text-primary transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Матч
                    </button>
                  )}
                </div>
              ))}

              {isAdmin && (
                <div className="flex items-center">
                  <button
                    onClick={handleAddRound}
                    className="h-10 px-4 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-400 hover:bg-zinc-700 transition-all text-sm font-medium whitespace-nowrap cursor-pointer"
                  >
                    + Раунд
                  </button>
                </div>
              )}
            </div>
          </Xwrapper>
        </div>
      </div>

      <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
        {activeBlock && (
          <>
            {isTeamMode ? (
              <div className="border border-zinc-700 rounded-lg bg-zinc-800 p-3">
                <h3 className="font-semibold">
                  {activeBlock.name || `Team ${activeBlock.uid}`}
                </h3>
                <div className="mt-2 space-y-2">
                  {activeBlock.users?.map((user: IUser) => (
                    <div key={user.id} className="flex items-center gap-2">
                      <UserInfoBlock {...user} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-zinc-800 p-2 rounded-lg border-2 border-primary shadow-2xl">
                <UserInfoBlock {...activeBlock} />
              </div>
            )}
          </>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default BracketTournamentView;
