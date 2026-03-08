import AddJudgeModalContent from "./AddJudgeModalContent/AddJudgeModalContent";
import { ITeam } from "@/app/utils/store/tournamentsSlice";
import CustomModal from "../CustomModal/CustomModal";
import { Plus, ShieldUser } from "lucide-react";
import { useState } from "react";
import { IUser } from "@/app/utils/store/userSlice";
import JudgeItem from "./JudgeItem/JudgeItem";
import { useAppSelector } from "@/app/utils/store/hooks";
import CustomButton from "../CustomButton/CustomButton";
import JudgeList from "./JudgeList/JudgeList";

const AddJudgeBlock = ({
  isTeamTournament,
  tournamentStatus,
  judgesIds,
  teams,
  usersIds,
}: {
  isTeamTournament: boolean;
  tournamentStatus: string;
  judgesIds: string[];
  teams: ITeam[];
  usersIds: string[];
}) => {
  const { user: currentUser } = useAppSelector((state) => state.user);
  const [isAddJudgeModalOpen, setIsAddJudgeModalOpen] = useState(false);

  const occupiedUserIds = new Set(
    isTeamTournament
      ? teams.flatMap((team) => {
          return team.usersIds;
        })
      : usersIds.concat(judgesIds),
  );

  const handleOpenAddJudgeModal = () => {
    setIsAddJudgeModalOpen(true);
  };

  const handleCloseAddJudgeModal = () => {
    setIsAddJudgeModalOpen(false);
  };

  return (
    <>
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldUser className="h-5 w-5 text-primary" />
            Судьи ({judgesIds.length})
          </h2>
          {(currentUser.role === "superadmin" ||
            currentUser.role === "admin") &&
            (tournamentStatus === "open" ||
              tournamentStatus === "about_to_start") && (
              <CustomButton
                label="Добавить"
                icon={<Plus className="h-4 w-4" />}
                onClick={handleOpenAddJudgeModal}
              />
            )}
        </div>
      </section>
      {!!judgesIds.length && <JudgeList judgesIds={judgesIds} />}
      {(currentUser.role === "superadmin" || currentUser.role === "admin") && (
        <CustomModal
          isOpen={isAddJudgeModalOpen}
          onClose={handleCloseAddJudgeModal}
        >
          <AddJudgeModalContent
            occupiedUserIds={occupiedUserIds}
            onClose={handleCloseAddJudgeModal}
          />
        </CustomModal>
      )}
    </>
  );
};

export default AddJudgeBlock;
