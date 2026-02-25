"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  updateBracketUser,
  addRound,
  addMatchToRound,
  updateTournament,
  ITournament,
} from "@/app/utils/store/tournamentsSlice";
import UserInfoBlock from "../Shared/UserInfoBlock/UserInfoBlock";
import axios from "axios";
import { IUser } from "@/app/utils/store/userSlice";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";

interface BracketProps {
  tournament: ITournament;
}

// --- Droppable Slot (Permission Aware) ---
const DroppableSlot = ({ id, player, label, isAdmin, onRemove }: any) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled: !isAdmin, // Disables collision detection for non-admins
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative p-2 min-h-[52px] border-b border-zinc-800/50 flex items-center justify-between transition-colors duration-200 ${
        isOver && isAdmin ? "bg-primary/20" : "bg-transparent"
      }`}
    >
      {player ? (
        <div className="flex items-center justify-between w-full group/player">
          <UserInfoBlock {...player} />
          {isAdmin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1 opacity-0 group-hover/player:opacity-100 hover:bg-red-500/20 rounded text-zinc-500 hover:text-red-400 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <span className="text-[10px] text-zinc-600 uppercase font-medium">
          {label}
        </span>
      )}
    </div>
  );
};

// --- Draggable User (Only used by Admin) ---
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
      className="flex items-center gap-2 p-2 bg-zinc-800 border border-zinc-700 rounded-lg cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
    >
      <GripVertical className="w-4 h-4 text-zinc-500" />
      <UserInfoBlock {...user} />
    </div>
  );
};

const BracketTournamentView = ({ tournament }: BracketProps) => {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.user);
  const [globalUsers, setGlobalUsers] = useState<IUser[]>([]);
  const [activeUser, setActiveUser] = useState<any>(null);

  // Memoize isAdmin to ensure stable dependency for useEffect
  const isAdmin = useMemo(
    () =>
      !!(currentUser?.role === "admin" || currentUser?.role === "superadmin"),
    [currentUser?.role],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  useEffect(() => {
    if (isAdmin) {
      axios
        .get("/api/users")
        .then((res) => setGlobalUsers(res.data.users || []));
    }
  }, [isAdmin]);

  const rounds = Array.isArray(tournament?.bracket?.rounds)
    ? tournament.bracket.rounds
    : [];

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveUser(null);
    if (!over || !isAdmin) return;

    const [roundId, matchId, slot] = (over.id as string).split("|");
    const user = active.data.current as any;
    const rIdx = rounds.findIndex((r) => r.id === roundId);
    const mIdx = rounds[rIdx]?.matches.findIndex((m) => m.id === matchId);

    if (rIdx === -1 || mIdx === -1) return;

    try {
      const tRef = doc(db, "tournaments", tournament.id);
      await updateDoc(tRef, {
        [`bracket.rounds.${rIdx}.matches.${mIdx}.${slot}`]: user,
      });
      dispatch(
        updateBracketUser({
          tournamentId: tournament.id,
          roundId,
          matchId,
          slot: slot as any,
          user,
        }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveUser = async (rId: string, mId: string, slot: string) => {
    if (!isAdmin) return;
    const rIdx = rounds.findIndex((r) => r.id === rId);
    const mIdx = rounds[rIdx]?.matches.findIndex((m) => m.id === mId);
    try {
      const tRef = doc(db, "tournaments", tournament.id);
      await updateDoc(tRef, {
        [`bracket.rounds.${rIdx}.matches.${mIdx}.${slot}`]: null,
      });
      dispatch(
        updateBracketUser({
          tournamentId: tournament.id,
          roundId: rId,
          matchId: mId,
          slot: slot as any,
          user: null,
        }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (rounds.length === 0 && !isAdmin) {
    return (
      <div className="p-10 text-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500">
        Турнирная сетка еще не сформирована.
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={(e) => isAdmin && setActiveUser(e.active.data.current)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-10">
        <div className="flex gap-10 items-start overflow-x-auto pb-10 custom-scrollbar">
          {rounds.map((round: any, rIdx: number) => (
            <div
              key={round.id}
              className="flex flex-col gap-4 min-w-[260px] group/round"
            >
              <div className="flex justify-between items-center px-1">
                <h3 className="font-bold text-zinc-500 uppercase text-[11px] tracking-widest">
                  {round.id}
                </h3>
                {isAdmin && (
                  <button
                    onClick={() => {}}
                    className="opacity-0 group-hover/round:opacity-100 text-zinc-600 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {round.matches.map((match: any) => (
                <div
                  key={match.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg"
                >
                  <DroppableSlot
                    id={`${round.id}|${match.id}|player1`}
                    player={match.player1}
                    label="Slot 1"
                    isAdmin={isAdmin}
                    onRemove={() =>
                      handleRemoveUser(round.id, match.id, "player1")
                    }
                  />
                  <DroppableSlot
                    id={`${round.id}|${match.id}|player2`}
                    player={match.player2}
                    label="Slot 2"
                    isAdmin={isAdmin}
                    onRemove={() =>
                      handleRemoveUser(round.id, match.id, "player2")
                    }
                  />
                </div>
              ))}

              {isAdmin && (
                <button
                  onClick={() =>
                    dispatch(
                      addMatchToRound({
                        tournamentId: tournament.id,
                        roundIndex: rIdx,
                      }),
                    )
                  }
                  className="p-2 border border-dashed border-zinc-800 rounded-lg text-zinc-600 hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <Plus className="w-4 h-4" /> Матч
                </button>
              )}
            </div>
          ))}

          {isAdmin && (
            <button
              onClick={() =>
                dispatch(addRound({ tournamentId: tournament.id }))
              }
              className="h-10 px-4 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-400 hover:bg-zinc-700 transition-all text-sm font-medium whitespace-nowrap"
            >
              + Раунд
            </button>
          )}
        </div>

        {/* Hide player bench completely for non-admins */}
        {isAdmin && globalUsers.length > 0 && (
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 backdrop-blur-sm">
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
        {activeUser && isAdmin ? (
          <div className="flex items-center gap-2 bg-zinc-800 p-2 rounded-lg border-2 border-primary shadow-2xl pointer-events-none">
            <UserInfoBlock {...activeUser} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default BracketTournamentView;
