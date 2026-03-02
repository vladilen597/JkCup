import handleGetUsersByIds from "@/app/utils/requests/getUsersByIds";
import { IUser } from "@/app/utils/store/userSlice";
import { useEffect, useState } from "react";
import JudgeLine from "../JudgeItem/JudgeItem";

const JudgeList = ({ judgesIds }: { judgesIds: string[] }) => {
  const [judges, setJudges] = useState<IUser[]>([]);

  const handleLoadJudges = async () => {
    try {
      const users = await handleGetUsersByIds(judgesIds);
      setJudges(users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleLoadJudges();
  }, [judgesIds]);

  return (
    <ul className="mt-2 rounded-lg border border-border/50 overflow-hidden">
      {judges.map((judge, index) => (
        <JudgeLine key={judge.uid} user={judge} index={index} />
      ))}
    </ul>
  );
};

export default JudgeList;
