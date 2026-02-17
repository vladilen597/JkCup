import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import JoinTeamButton from "../JoinTeamButton/JoinTeamButton";
import TeamUserItem from "../TeamUserItem/TeamUserItem";
import { doc, updateDoc } from "firebase/firestore";
import {
  addTeamParticipant,
  ITeam,
  removeTeam,
  removeTeamParticipant,
} from "@/app/utils/store/tournamentsSlice";
import { Lock, Trash2 } from "lucide-react";
import { db } from "@/app/utils/firebase";
import { useParams } from "next/navigation";
import CustomModal from "../../Shared/CustomModal/CustomModal";
import UserAddList from "./UserAddList/UserAddList";
import { IUser } from "@/app/utils/store/userSlice";
import { useState } from "react";

interface ITeamItemProps extends ITeam {
  filled: number;
  teams: ITeam[];
  players_per_team: number;
  is_my_team: boolean;
}

const TeamItem = ({
  uid,
  name,
  is_private,
  filled,
  players_per_team,
  users,
  creator_uid,
  is_my_team,
  teams,
}: ITeamItemProps) => {
  const { user: currentUser } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const { id: tournamentId }: { id: string } = useParams();
  const [isAddTeammateModalOpen, setIsAddTeammateModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleOpenAddTeammateModal = () => {
    setIsAddTeammateModalOpen(true);
  };

  const handleCloseAddTeammateModal = () => {
    setIsAddTeammateModalOpen(false);
  };

  const isEnoughRole =
    currentUser.role === "admin" || currentUser.role === "superadmin";

  const handleDeleteTeam = async (teamId: string) => {
    try {
      const tournamentRef = doc(db, "tournaments", tournamentId);
      const teamToDelete = teams.find((team) => team.uid === teamId);

      if (teamToDelete) {
        await updateDoc(tournamentRef, {
          teams: teams.filter((team) => team.uid !== teamId),
        });

        dispatch(removeTeam({ tournamentId, teamId }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLeaveTeam = async (clickedUser: IUser) => {
    try {
      const tournamentRef = doc(db, "tournaments", tournamentId);

      const updatedTeams = teams.map((team) => {
        if (team.uid === uid) {
          return {
            ...team,
            users: team.users.filter((user) => user.uid !== clickedUser.uid),
          };
        } else {
          return team;
        }
      });

      dispatch(removeTeamParticipant({ tournamentId, updatedTeams }));

      await updateDoc(tournamentRef, {
        teams: updatedTeams,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleJoinTeam = async () => {
    setIsLoading(true);
    try {
      const tournamentRef = doc(db, "tournaments", tournamentId);

      await updateDoc(tournamentRef, {
        teams: teams.map((team) => {
          if (team.uid === uid) {
            return {
              ...team,
              users: [...team.users, currentUser],
            };
          }
          return team;
        }),
      });

      dispatch(
        addTeamParticipant({ tournamentId, teamId: uid, user: currentUser }),
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <li
        key={uid}
        className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-primary/50 transition-all not-first:mt-2"
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">
              {name || `Команда ${uid.slice(0, 6)}`}
            </h3>
            {is_private && <Lock className="w-4 h-4 text-neutral-500" />}
            {(creator_uid === currentUser.uid || isEnoughRole) && (
              <button
                type="button"
                className="bg-red-500 p-1 rounded-sm text-white cursor-pointer"
                onClick={() => handleDeleteTeam(uid)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <span className="text-sm text-gray-400">
            {filled} / {players_per_team}
          </span>
        </div>

        <div className="space-y-2">
          {users.map((user) => (
            <TeamUserItem
              {...user}
              isMyTeam={is_my_team}
              isLoading={isLoading}
              isCurrentUserCreator={currentUser.uid === creator_uid}
              onLeaveClick={() => handleLeaveTeam(user)}
            />
          ))}
          <JoinTeamButton
            isTeamPrivate={is_private}
            isCurrentUserCreator={currentUser.uid === creator_uid}
            isLoading={isLoading}
            onJoinClick={handleJoinTeam}
            handleClickInvite={handleOpenAddTeammateModal}
            isMyTeam={is_my_team}
            isTeamFull={players_per_team === users.length}
          />
        </div>
      </li>
      <CustomModal
        isOpen={isAddTeammateModalOpen}
        onClose={handleCloseAddTeammateModal}
      >
        <UserAddList teamId={uid} handleClose={handleCloseAddTeammateModal} />
      </CustomModal>
    </>
  );
};

export default TeamItem;
