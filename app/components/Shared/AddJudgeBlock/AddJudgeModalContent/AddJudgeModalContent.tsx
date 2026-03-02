import JudgeAddList from "./JudgeAddList/JudgeAddList";

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
