import UserInfoBlock from "../../Shared/UserInfoBlock/UserInfoBlock";
import { IFeedback } from "../FeedbackList";
import { format } from "date-fns";

const FeedbackItem = ({ id, text, created_at, creator }: IFeedback) => {
  return (
    <li className="border border-neon/20! bg-background p-3 rounded-lg">
      <span className="text-neutral-400 text-sm">Обращение {id}</span>
      <div className="mt-2 p-2">{text}</div>
      <div className="mt-4 flex items-end justify-between">
        <div className="flex items-center gap-2">
          <UserInfoBlock size="small" {...creator} />
        </div>
        <span className="text-neutral-400 text-xs">
          {created_at && format(created_at, "dd.MM.yyyy HH:mm")}
        </span>
      </div>
    </li>
  );
};

export default FeedbackItem;
