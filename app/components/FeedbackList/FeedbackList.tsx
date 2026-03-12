import { FirestoreTimestamp } from "@/app/lib/types";
import { IUser } from "@/app/utils/store/userSlice";
import FeedbackItem from "./FeedbackItem/FeedbackItem";
import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import { Loader2 } from "lucide-react";

export interface IFeedback {
  id: string;
  creator: IUser;
  createdAt: FirestoreTimestamp;
  text: string;
}

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadFeedbacks = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "feedback"));
      const snap = getDocs(q);
      const data = (await snap).docs.map((doc) => ({
        ...(doc.data() as IFeedback),
      }));
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
    <ul className="max-h-100 space-y-2 px-2">
      {feedbacks.map((feedback) => (
        <FeedbackItem key={feedback.id} {...feedback} />
      ))}
    </ul>
  );
};

export default FeedbackList;
