import { useAppSelector } from "@/app/utils/store/hooks";
import JoinTeamButton from "../JoinTeamButton/JoinTeamButton";
import { doc, updateDoc } from "firebase/firestore";
import { ITeam } from "@/app/utils/store/tournamentsSlice";
import { Lock, Trash2 } from "lucide-react";
import { db } from "@/app/utils/firebase";
import { useParams } from "next/navigation";
import CustomModal from "../../Shared/CustomModal/CustomModal";
import UserAddList from "./UserAddList/UserAddList";
import { useState } from "react";
import CustomButton, {
  BUTTON_TYPES,
} from "../../Shared/CustomButton/CustomButton";
import TeamUserList from "../TeamUserList/TeamUserList";

interface ITeamItemProps extends ITeam {
  filled: number;
  teams: ITeam[];
  players_per_team: number;
  tournament_status: string;
  canJoin: boolean;
  occupiedUserIds: Set<string>;
}

const TeamItem = ({
  uid,
  name,
  is_private,
  filled,
  players_per_team,
  usersIds,
  creator_uid,
  canJoin,
  tournament_status,
  teams,
  occupiedUserIds,
}: ITeamItemProps) => {
  const { user: currentUser } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const { id: tournamentId }: { id: string } = useParams();
  const [isAddTeammateModalOpen, setIsAddTeammateModalOpen] = useState(false);

  const handleOpenAddTeammateModal = () => {
    setIsAddTeammateModalOpen(true);
  };

  const handleCloseAddTeammateModal = () => {
    setIsAddTeammateModalOpen(false);
  };

  const isEnoughRole =
    currentUser.role === "admin" || currentUser.role === "superadmin";
  const isMyTeam = usersIds.includes(currentUser.uid);

  const handleDeleteTeam = async (teamId: string) => {
    try {
      const tournamentRef = doc(db, "tournaments", tournamentId);
      const teamToDelete = teams.find((team) => team.uid === teamId);

      if (teamToDelete) {
        await updateDoc(tournamentRef, {
          teams: teams.filter((team) => team.uid !== teamId),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLeaveTeam = async (clickedUserUid: string) => {
    try {
      const tournamentRef = doc(db, "tournaments", tournamentId);

      const updatedTeams = teams.map((team) => {
        if (team.uid === uid) {
          return {
            ...team,
            usersIds: team.usersIds.filter(
              (userId) => userId !== clickedUserUid,
            ),
          };
        } else {
          return team;
        }
      });

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
              usersIds: [...team.usersIds, currentUser.uid],
            };
          }
          return team;
        }),
      });
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
        className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-primary/50 transition-all"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">
            {name || `Команда ${uid.slice(0, 6)}`}
          </h3>
          <div className="flex items-center gap-2">
            {is_private && <Lock className="w-4 h-4 text-neutral-500" />}
            <span className="text-sm text-gray-400">
              {filled} / {players_per_team}
            </span>
            {((creator_uid === currentUser.uid &&
              tournament_status === "open") ||
              isEnoughRole) && (
              <CustomButton
                className="p-1 rounded-sm bg-red-600/20 border border-red-600!"
                buttonType={BUTTON_TYPES.DANGER}
                icon={<Trash2 className="w-4 h-4 text-red-600" />}
                onClick={() => handleDeleteTeam(uid)}
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <TeamUserList
            usersIds={usersIds}
            isLoading={isLoading}
            isCurrentUserCreator={currentUser.uid === creator_uid}
            onLeaveClick={handleLeaveTeam}
            canLeave={tournament_status === "open"}
          />
          {tournament_status === "open" && (
            <JoinTeamButton
              isTeamPrivate={is_private}
              isCurrentUserCreator={currentUser.uid === creator_uid}
              isLoading={isLoading}
              onJoinClick={handleJoinTeam}
              handleClickInvite={handleOpenAddTeammateModal}
              isMyTeam={isMyTeam}
              canJoin={canJoin}
              isTeamFull={players_per_team === usersIds.length}
            />
          )}
        </div>
      </li>
      <CustomModal
        isOpen={isAddTeammateModalOpen}
        onClose={handleCloseAddTeammateModal}
      >
        <UserAddList
          teamId={uid}
          handleClose={handleCloseAddTeammateModal}
          occupiedUserIds={occupiedUserIds}
        />
      </CustomModal>
    </>
  );
};

export default TeamItem;
