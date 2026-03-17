import handleGetUsersByIds from "@/app/utils/requests/getUsersByIds";
import { useEffect, useState } from "react";
import JudgeLine from "../JudgeItem/JudgeItem";
import { ITournamentJudge, IUser } from "@/app/lib/types";

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
