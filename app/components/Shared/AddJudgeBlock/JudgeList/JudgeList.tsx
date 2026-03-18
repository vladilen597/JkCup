import JudgeLine from "../JudgeItem/JudgeItem";
import { ITournamentJudge } from "@/app/lib/types";

const JudgeList = ({ judges }: { judges: ITournamentJudge[] }) => {
  return (
    <ul className="mt-2 rounded-lg border border-border/50 overflow-hidden">
      {judges.map((judge, index) => (
        <JudgeLine key={judge.profile_id} user={judge.profile} index={index} />
      ))}
    </ul>
  );
};

export default JudgeList;
