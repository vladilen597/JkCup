import UserInfoBlock from "@/app/components/Shared/UserInfoBlock/UserInfoBlock";
import { ITeamMember } from "@/app/lib/types";

const SelectTeamUserList = ({ members }: { members: ITeamMember[] }) => {
  return (
    <ul className="space-y-2">
      {members.map((member) => (
        <li key={member.profile_id}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <UserInfoBlock {...member.profile} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SelectTeamUserList;
