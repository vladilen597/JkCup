import UserAddList from "@/app/components/TeamsList/TeamItem/UserAddList/UserAddList";
import JudgeAddList from "./JudgeAddList/JudgeAddList";
import { ITeam } from "@/app/utils/store/tournamentsSlice";

const AddJudgeModalContent = ({
  occupiedUserIds,
  onClose,
}: {
  occupiedUserIds: Set<string>;
  onClose: () => void;
}) => {
  return (
    <JudgeAddList occupiedUserIds={occupiedUserIds} handleClose={onClose} />
  );
};

export default AddJudgeModalContent;
