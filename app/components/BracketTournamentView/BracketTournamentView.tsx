"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { Plus, Trash2, Users, GripVertical, X } from "lucide-react";
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
} from "@/app/utils/store/tournamentsSlice";
import UserInfoBlock from "../Shared/UserInfoBlock/UserInfoBlock";
import axios from "axios";
import { IUser } from "@/app/utils/store/userSlice";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { doc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/app/utils/firebase";

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
  id,
  player,
  label,
  isAdmin,
  onRemove,
  isPlaceholder,
}: any) => {
  const { isOver, setNodeRef } = useDroppable({ id, disabled: !isAdmin });
  return (
    <div
      ref={setNodeRef}
      className={`w-full relative p-2 min-h-13 border-b border-zinc-800/50 flex items-center justify-between transition-colors duration-200 ${
        isOver && isAdmin ? "bg-primary/20" : "bg-transparent"
      } ${isPlaceholder ? "border-b-0" : ""}`}
    >
      {player ? (
        <div className="flex items-center justify-between w-full group/player">
          <div className="flex items-center gap-2">
            <UserInfoBlock {...player} />
          </div>
          {isAdmin && (
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
    data: user,
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

const BracketTournamentView = ({ tournament }: BracketProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.user);
  const [globalUsers, setGlobalUsers] = useState<IUser[]>([]);
  const [activeUser, setActiveUser] = useState<any>(null);

  const isAdmin = useMemo(
    () =>
      !!(currentUser?.role === "admin" || currentUser?.role === "superadmin"),
    [currentUser?.role],
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleScroll = () => {
    useXarrow();
  };

  useEffect(() => {
    if (isAdmin)
      axios
        .get("/api/users")
        .then((res) => setGlobalUsers(res.data.users || []));
  }, [isAdmin]);

  const rounds = useMemo(
    () =>
      Array.isArray(tournament?.bracket?.rounds)
        ? tournament.bracket.rounds
        : [],
    [tournament?.bracket?.rounds],
  );

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
    updated[rIdx].matches.push({ id: uuidv4(), users: [], score: "0:0" });
    syncRounds(updated);
  };

  const handleRemoveMatch = (rId: string, mId: string) => {
    const updated = rounds.map((r: any) => {
      if (r.id !== rId) return r;
      return { ...r, matches: r.matches.filter((m: any) => m && m.id !== mId) };
    });
    syncRounds(updated);
  };

  const handleRemoveUserFromMatch = (
    rId: string,
    mId: string,
    userUid: string,
  ) => {
    const updated = rounds.map((r: any) => {
      if (r.id !== rId) return r;
      return {
        ...r,
        matches: r.matches.map((m: any) => {
          if (!m || m.id !== mId) return m;
          return {
            ...m,
            users: (m.users || []).filter((u: any) => u.uid !== userUid),
          };
        }),
      };
    });
    syncRounds(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveUser(null);
    if (!over || !isAdmin) return;
    const [roundId, matchId] = (over.id as string).split("|");
    const user = active.data.current as any;

    const updated = rounds.map((r: any) => {
      if (r.id !== roundId) return r;
      return {
        ...r,
        matches: r.matches.map((m: any) => {
          if (!m || m.id !== matchId) return m;
          // To restore the 2-player limit, uncomment: if (m.users?.length >= 2) return m;
          return { ...m, users: [...(m.users || []), user] };
        }),
      };
    });
    syncRounds(updated);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={(e) => setActiveUser(e.active.data.current)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-10">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="relative overflow-x-auto pb-20 custom-scrollbar"
        >
          <Xwrapper>
            <div className="inline-flex gap-24 items-stretch min-h-[600px] p-4">
              {rounds.map((round: any, rIdx: number) => (
                <div
                  key={round.id}
                  className="flex flex-col justify-around gap-4 min-w-[260px] group/round"
                >
                  <div className="flex justify-between items-center px-1 mb-4">
                    <h3 className="font-bold text-zinc-500 uppercase text-[11px] tracking-widest">
                      Раунд {rIdx + 1}
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
                              {match.users?.map((u: any) => (
                                <DroppableSlot
                                  key={u.uid}
                                  id={`${round.id}|${match.id}|user-${u.uid}`}
                                  player={u}
                                  isAdmin={isAdmin}
                                  onRemove={() =>
                                    handleRemoveUserFromMatch(
                                      round.id,
                                      match.id,
                                      u.uid,
                                    )
                                  }
                                />
                              ))}
                              {isAdmin && (
                                <DroppableSlot
                                  id={`${round.id}|${match.id}|placeholder`}
                                  player={null}
                                  label="Добавить игрока"
                                  isAdmin={isAdmin}
                                  isPlaceholder={true}
                                />
                              )}
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

        {isAdmin && globalUsers.length > 0 && (
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 backdrop-blur-sm mx-4">
            <h4 className="flex items-center gap-2 mb-4 font-bold text-zinc-400 text-sm uppercase tracking-tight">
              <Users className="w-4 h-4" /> Доступные игроки
            </h4>
            <div className="flex flex-wrap gap-2">
              {globalUsers.map((u: any) => (
                <DraggableUser key={u.uid} user={u} />
              ))}
            </div>
          </div>
        )}
      </div>

      <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
        {activeUser && (
          <div className="flex items-center gap-2 bg-zinc-800 p-2 rounded-lg border-2 border-primary shadow-2xl">
            <UserInfoBlock {...activeUser} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default BracketTournamentView;
