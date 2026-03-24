"use client";

import React, { useState, useMemo, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
} from "@dnd-kit/core";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import PlayersSelectBlock from "./PlayersSelectBlock/PlayersSelectBlock";
import BracketDragOverlay from "./BracketDragOverlay/BracketDragOverlay";
import {
  addMatch,
  addRound,
  removeMatch,
  removeMatchParticipant,
  updateTournament,
} from "@/app/utils/store/tournamentsSlice";
import ChangeInfoInput from "./ChangeInfoInput/ChangeInfoInput";
import DroppableSlot from "./DroppableSlot/DroppableSlot";
import { ITournament } from "@/app/lib/types";
import { toast } from "react-toastify";
import axios from "axios";

interface BracketProps {
  tournament: ITournament;
}

const MatchBox = ({ match, isAdmin, onRemoveMatch, children }: any) => {
  // useXarrow();
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

const BracketTournamentView = ({ tournament }: BracketProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  const [activeBlock, setActiveBlock] = useState<any>(null);

  const isAdmin = useMemo(
    () =>
      !!(currentUser?.role === "admin" || currentUser?.role === "superadmin"),
    [currentUser?.role],
  );

  const isTeamMode = tournament.type === "team";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleScroll = () => {
    // useXarrow();
  };

  const rounds = useMemo(() => {
    return Array.isArray(tournament?.rounds) ? tournament.rounds : [];
  }, [tournament?.rounds]);

  const updateLocalBracket = (updatedTournament: ITournament) => {
    dispatch(updateTournament(updatedTournament));
  };

  const handleAddRound = async () => {
    try {
      const { data: newRound } = await axios.post(
        `/api/tournaments/${tournament.id}/bracket/rounds`,
        {
          number: tournament.rounds?.length || 0,
          name: `Раунд ${(tournament.rounds?.length || 0) + 1}`,
        },
      );

      dispatch(
        addRound({
          tournamentId: tournament.id,
          round: newRound,
        }),
      );

      toast.success("Раунд добавлен");
    } catch (err) {
      console.error("Ошибка при создании раунда", err);
      toast.error("Не удалось добавить раунд");
    }
  };

  const handleRemoveRound = async (roundId: string) => {
    if (!isAdmin) return;

    try {
      const { data } = await axios.delete(
        `/api/tournaments/${tournament.id}/bracket/rounds/${roundId}`,
      );

      dispatch(updateTournament(data));
      toast.success("Раунд удален");
    } catch (err: any) {
      console.error("Ошибка при удалении раунда", err);
      toast.error("Не удалось удалить раунд");
    }
  };

  const handleAddMatch = async (roundId: string) => {
    try {
      const { data: newMatch } = await axios.post(
        `/api/tournaments/${tournament.id}/bracket/rounds/${roundId}/matches`,
      );

      dispatch(
        addMatch({
          tournamentId: tournament.id,
          roundId: roundId,
          match: newMatch,
        }),
      );

      toast.success("Матч добавлен");
    } catch (err) {
      toast.error("Ошибка при создании матча");
    }
  };

  const handleRemoveMatch = async (roundId: string, matchId: string) => {
    try {
      await axios.delete(
        `/api/tournaments/${tournament.id}/bracket/rounds/${roundId}/matches/${matchId}`,
      );
      dispatch(removeMatch({ tournamentId: tournament.id, roundId, matchId }));
      toast.success("Матч удален");
    } catch (err) {
      toast.error("Ошибка при удалении матча");
    }
  };

  // const handleSetWinner = async (matchId: string, participantId: string) => {
  //   try {
  //     const { data } = await axios.patch(
  //       `/api/tournaments/${tournament.id}/matches/${matchId}/winner`,
  //       {
  //         participantId,
  //       },
  //     );
  //     updateLocalBracket(data);
  //   } catch (err) {
  //     console.error("Failed to set winner:", err);
  //   }
  // };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !isAdmin || !tournament?.id) return;

    const [matchId, slot, roundId] = (over.id as string).split("|");
    const participant = active.data.current as any;

    if (!matchId || !slot || !roundId) {
      console.error("Не удалось извлечь ID из слота:", over.id);
      return;
    }

    try {
      const url = `/api/tournaments/${tournament.id}/bracket/rounds/${roundId}/matches/${matchId}/participants`;

      const { data } = await axios.post(url, {
        profileId: !isTeamMode ? participant.id : null,
        teamId: isTeamMode ? participant.id : null,
        slot: parseInt(slot),
      });

      dispatch(updateTournament(data));
      toast.success("Участник добавлен в матч");
    } catch (err: any) {
      console.error(
        "Ошибка при добавлении участника:",
        err.response?.data || err.message,
      );
      toast.error(err.response?.data?.error || "Ошибка при обновлении сетки");
    }
  };

  const handleRemoveParticipantFromMatch = async (
    matchId: string,
    participantRecordId: string,
    roundId: string,
  ) => {
    if (!isAdmin) return;

    try {
      const url = `/api/tournaments/${tournament.id}/bracket/rounds/${roundId}/matches/${matchId}/participants`;

      await axios.delete(url, {
        data: { participantRecordId },
      });

      dispatch(
        removeMatchParticipant({
          tournamentId: tournament.id,
          roundId,
          matchId,
          participantRecordId,
        }),
      );

      // toast.success("Участник удален");
    } catch (err: any) {
      console.error("Ошибка при удалении:", err);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={(e) => setActiveBlock(e.active.data.current)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-10 w-fit">
        <PlayersSelectBlock
          isTeamMode={isTeamMode}
          teams={tournament.teams}
          registrations={tournament.registrations}
        />
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="relative overflow-x-auto custom-scrollbar"
        >
          {/* <Xwrapper> */}
          <div className="inline-flex gap-12 items-stretch min-h-150 p-4">
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
                          <div className="flex flex-col min-w-45">
                            <DroppableSlot
                              match={match}
                              roundId={round.id}
                              slot={1}
                              isAdmin={isAdmin}
                              label="Участник 1"
                              onRemove={handleRemoveParticipantFromMatch}
                              onWinnerClick={() => {}}
                              // onWinnerClick={handleSetWinner}
                            />

                            <ChangeInfoInput
                              matchId={match.id}
                              currentValue={match.metadata?.info || ""}
                              disabled={!isAdmin}
                              onUpdate={async (mId, info) => {
                                const { data } = await axios.patch(
                                  `/api/matches/${mId}`,
                                  {
                                    metadata: { ...match.metadata, info },
                                  },
                                );
                                dispatch(updateTournament(data));
                              }}
                            />

                            <DroppableSlot
                              match={match}
                              roundId={round.id}
                              slot={2}
                              isAdmin={isAdmin}
                              label="Участник 2"
                              onRemove={handleRemoveParticipantFromMatch}
                              onWinnerClick={() => {}}
                              // onWinnerClick={handleSetWinner}
                            />
                          </div>
                        </MatchBox>

                        {/* {match.next_match_id && (
                          <Xarrow
                            start={match.id}
                            end={match.next_match_id}
                            strokeWidth={2}
                            color="#3f3f46"
                            path="grid"
                            headSize={0}
                            startAnchor="right"
                            endAnchor="left"
                          />
                        )} */}
                      </React.Fragment>
                    );
                  })}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleAddMatch(round.id)}
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
          {/* </Xwrapper> */}
        </div>
      </div>

      <BracketDragOverlay activeBlock={activeBlock} isTeamMode={isTeamMode} />
    </DndContext>
  );
};

export default BracketTournamentView;
