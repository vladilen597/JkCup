import { format } from "date-fns";
import UserInfoBlock from "../../Shared/UserInfoBlock/UserInfoBlock";
import { IFeedback } from "../FeedbackList";

const FeedbackItem = ({ id, text, createdAt, creator }: IFeedback) => {
  return (
    <li className="border border-neon/20! bg-muted p-3 rounded-lg">
      <span className="text-neutral-400 text-sm">Обращение {id}</span>
      <div className="mt-2 p-2">{text}</div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserInfoBlock {...creator} />
        </div>
        {createdAt && format(createdAt?.toDate(), "dd.MM.yyyy HH:mm")}
      </div>
    </li>
  );
};

export default FeedbackItem;
