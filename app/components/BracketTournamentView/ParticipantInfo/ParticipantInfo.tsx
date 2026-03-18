import { Users } from "lucide-react";
import UserInfoBlock from "../../Shared/UserInfoBlock/UserInfoBlock";

const ParticipantInfo = ({ data }: { data: any }) => {
  const isTeam = !!data.members;

  if (isTeam) {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <Users className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
        <div className="min-w-0">
          <h3 className="font-semibold text-sm truncate">
            {data.name || "Без названия"}
          </h3>
          <ul className="mt-2 space-y-2">
            {data.members.map((member) => (
              <li className="flex items-center gap-2">
                <UserInfoBlock size="small" {...member.profile} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <UserInfoBlock {...data} />
    </div>
  );
};

export default ParticipantInfo;
