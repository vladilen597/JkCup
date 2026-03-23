import JudgeLine from "../JudgeItem/JudgeItem";
import { IArchivedJudge, ITournamentJudge } from "@/app/lib/types";

const JudgeList = ({
  judges,
  hideDelete,
}: {
  judges: ITournamentJudge[] | IArchivedJudge[];
  hideDelete?: boolean;
}) => {
  return (
    <ul className="mt-2 rounded-lg border border-border/50 overflow-hidden">
      {judges.map((judge, index) => (
        <JudgeLine
          key={judge.profile_id}
          user={judge.profile}
          index={index}
          hideDelete={hideDelete}
        />
      ))}
    </ul>
  );
};

export default JudgeList;
