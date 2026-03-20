import AddJudgeModalContent from "./AddJudgeModalContent/AddJudgeModalContent";
import CustomModal from "../CustomModal/CustomModal";
import { Plus, ShieldUser } from "lucide-react";
import { useState } from "react";
import { useAppSelector } from "@/app/utils/store/hooks";
import CustomButton from "../CustomButton/CustomButton";
import JudgeList from "./JudgeList/JudgeList";
import { IUser } from "@/app/lib/types";

import {
  ITournament,
  ITeam,
  ITournamentRegistration,
  ITournamentJudge,
} from "@/app/lib/types";

const AddJudgeBlock = ({
  isTeamTournament,
  tournamentStatus,
  judges = [],
  teams = [],
  registrations = [],
}: {
  isTeamTournament: boolean;
  tournamentStatus: string;
  judges: ITournamentJudge[];
  teams: ITeam[];
  registrations: ITournamentRegistration[];
}) => {
  const { currentUser } = useAppSelector((state) => state.user);
  const [isAddJudgeModalOpen, setIsAddJudgeModalOpen] = useState(false);

  const occupiedUserIds = new Set<string>();

  if (isTeamTournament) {
    teams.forEach((team) => {
      team.members?.forEach((member) => occupiedUserIds.add(member.profile_id));
    });
  } else {
    registrations.forEach((reg) => occupiedUserIds.add(reg.profile_id));
  }

  judges.forEach((j) => occupiedUserIds.add(j.profile_id));

  return (
    <>
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldUser className="h-5 w-5 text-primary" />
            Судьи ({judges.length})
          </h2>
          {(currentUser.role === "superadmin" ||
            currentUser.role === "admin") &&
            (tournamentStatus === "open" ||
              tournamentStatus === "about_to_start") && (
              <CustomButton
                label="Добавить"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => setIsAddJudgeModalOpen(true)}
              />
            )}
        </div>
      </section>

      {judges.length > 0 && <JudgeList judges={judges} />}

      {(currentUser.role === "superadmin" || currentUser.role === "admin") && (
        <CustomModal
          containerClassName="max-h-[80vh]"
          isOpen={isAddJudgeModalOpen}
          onClose={() => setIsAddJudgeModalOpen(false)}
        >
          <AddJudgeModalContent
            occupiedUserIds={occupiedUserIds}
            onClose={() => setIsAddJudgeModalOpen(false)}
          />
        </CustomModal>
      )}
    </>
  );
};

export default AddJudgeBlock;
