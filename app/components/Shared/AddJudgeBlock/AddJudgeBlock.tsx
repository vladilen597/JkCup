import AddJudgeModalContent from "./AddJudgeModalContent/AddJudgeModalContent";
import { ITeam } from "@/app/utils/store/tournamentsSlice";
import CustomModal from "../CustomModal/CustomModal";
import { Plus, ShieldUser } from "lucide-react";
import { useState } from "react";
import { IUser } from "@/app/utils/store/userSlice";
import JudgeItem from "./JudgeItem/JudgeItem";
import { useAppSelector } from "@/app/utils/store/hooks";
import CustomButton from "../CustomButton/CustomButton";

const AddJudgeBlock = ({
  isTeamTournament,
  tournamentStatus,
  judges,
  teams,
  users,
}: {
  isTeamTournament: boolean;
  tournamentStatus: string;
  judges: IUser[];
  teams: ITeam[];
  users: IUser[];
}) => {
  const { user: currentUser } = useAppSelector((state) => state.user);
  const [isAddJudgeModalOpen, setIsAddJudgeModalOpen] = useState(false);

  const occupiedUserIds = new Set(
    isTeamTournament
      ? teams.flatMap((team) => {
          return team.users?.map((user) => user.uid) || [];
        })
      : users?.map((user) => user.uid),
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
            Судьи ({judges.length})
          </h2>
          {currentUser.role !== "user" &&
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
      {!!judges.length && (
        <ul className="mt-2 space-y-2 rounded-lg border border-border/50 overflow-hidden">
          {judges.map((judge, index) => (
            <JudgeItem key={judge.uid} user={judge} index={index} />
          ))}
        </ul>
      )}
      {currentUser.role !== "user" && (
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
