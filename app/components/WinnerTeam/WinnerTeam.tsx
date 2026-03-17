import UserInfoBlock from "../Shared/UserInfoBlock/UserInfoBlock";
import { ITeamMember } from "@/app/lib/types";

const WinnerTeam = ({ members }: { members: ITeamMember[] }) => {
  if (!members || members.length === 0) return null;

  return (
    <ul className="mt-2 space-y-2">
      {members.map((member) => (
        <li key={member.profile.id} className="flex items-center gap-2">
          <UserInfoBlock {...member.profile} />
        </li>
      ))}
    </ul>
  );
};

export default WinnerTeam;
