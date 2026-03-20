import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import JoinTeamButton from "../JoinTeamButton/JoinTeamButton";
import {
  addTeamParticipant,
  removeTeam,
  removeTeamParticipant,
} from "@/app/utils/store/tournamentsSlice";
import { Lock, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import CustomModal from "../../Shared/CustomModal/CustomModal";
import UserAddList from "./UserAddList/UserAddList";
import { useState } from "react";
import CustomButton, {
  BUTTON_TYPES,
} from "../../Shared/CustomButton/CustomButton";
import TeamUserList from "../TeamUserList/TeamUserList";
import { ITeam } from "@/app/lib/types";
import axios from "axios";
import { toast } from "react-toastify";

interface ITeamItemProps extends ITeam {
  filled: number;
  teams: ITeam[];
  players_per_team: number;
  tournament_status: string;
  canJoin: boolean;
  occupiedUserIds: Set<string>;
}

const TeamItem = ({
  id,
  name,
  is_private,
  filled,
  players_per_team,
  members,
  creator_id,
  canJoin,
  tournament_status,
  occupiedUserIds,
}: ITeamItemProps) => {
  const { currentUser } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
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
  const isMyTeam = members.some(
    (member) => member.profile_id === currentUser.id,
  );

  const handleDeleteTeam = async (teamId: string) => {
    setIsDeleteLoading(true);
    try {
      await axios.delete(`/api/tournaments/${tournamentId}/teams/${teamId}`);

      dispatch(removeTeam({ tournamentId, teamId }));

      toast.success("Команда удалена");
    } catch (error: any) {
      console.error(error);
      toast.error("Ошибка при удалении команды");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    setIsLoading(true);
    try {
      const { data: newMember } = await axios.post(`/api/teams/${id}/members`, {
        userId: currentUser.id,
      });

      dispatch(
        addTeamParticipant({
          tournamentId,
          teamId: id,
          member: newMember,
        }),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveTeam = async (
    teamMemberRecordId: string,
    profileId: string,
  ) => {
    try {
      await axios.delete(`/api/tournaments/${tournamentId}/teams/members`, {
        data: { teamMemberRecordId },
      });

      dispatch(
        removeTeamParticipant({
          tournamentId,
          teamId: id,
          userId: profileId,
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <li
        key={id}
        className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-primary/50 transition-all"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">
            {name || `Команда ${id.slice(0, 6)}`}
          </h3>
          <div className="flex items-center gap-2">
            {is_private && <Lock className="w-4 h-4 text-neutral-500" />}
            <span className="text-sm text-gray-400">
              {filled} / {players_per_team}
            </span>
            {((creator_id === currentUser.id && tournament_status === "open") ||
              isEnoughRole) && (
              <CustomButton
                className="p-1 rounded-sm bg-red-600/20 border border-red-600!"
                buttonType={BUTTON_TYPES.DANGER}
                isLoading={isDeleteLoading}
                icon={<Trash2 className="w-4 h-4 text-red-600" />}
                onClick={() => handleDeleteTeam(id)}
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <TeamUserList
            members={members}
            isMyTeam={isMyTeam}
            isLoading={isLoading}
            creator_id={creator_id}
            isCurrentUserCreator={currentUser.id === creator_id}
            onLeaveClick={handleLeaveTeam}
            canLeave={tournament_status === "open"}
          />
          {tournament_status === "open" && (
            <JoinTeamButton
              isTeamPrivate={is_private}
              isCurrentUserCreator={currentUser.id === creator_id}
              isLoading={isLoading}
              onJoinClick={handleJoinTeam}
              handleClickInvite={handleOpenAddTeammateModal}
              isMyTeam={isMyTeam}
              canJoin={canJoin}
              isTeamFull={players_per_team === members.length}
            />
          )}
        </div>
      </li>
      <CustomModal
        isOpen={isAddTeammateModalOpen}
        onClose={handleCloseAddTeammateModal}
      >
        <UserAddList
          teamId={id}
          handleClose={handleCloseAddTeammateModal}
          occupiedUserIds={occupiedUserIds}
        />
      </CustomModal>
    </>
  );
};

export default TeamItem;
