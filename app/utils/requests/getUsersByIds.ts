import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { IUser } from "../store/userSlice";

const handleGetUsersByIds = async (userIds: string[]) => {
  const q = query(collection(db, "users"), where(documentId(), "in", userIds));
  const snap = getDocs(q);
  const data = (await snap).docs.map((doc) => ({
    ...(doc.data() as IUser),
    uid: doc.id,
  }));
  return data;
};

export default handleGetUsersByIds;
