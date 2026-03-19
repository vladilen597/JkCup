import { FirestoreTimestamp, IUser } from "@/app/lib/types";
import FeedbackItem from "./FeedbackItem/FeedbackItem";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";

export interface IFeedback {
  id: string;
  creator: IUser;
  created_at: FirestoreTimestamp;
  text: string;
}

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadFeedbacks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/feedback");
      setFeedbacks(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleLoadFeedbacks();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full ">
        <Loader2 className="mx-auto animate-spin" />
      </div>
    );
  }

  return (
    <ul className="max-h-100 overflow-y-auto space-y-2 p-2">
      {feedbacks.map((feedback) => (
        <FeedbackItem key={feedback.id} {...feedback} />
      ))}
    </ul>
  );
};

export default FeedbackList;
