import { collection, getDocs, query, QuerySnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";

export interface Participant {
  id: string;
  displayName: string;
  photoURL: string | null;
  joinedAt?: any;
  status?: string;
}

export type ParticipantsList = Participant[];

export const getParticipants = async (
  tournamentId: string,
): Promise<ParticipantsList> => {
  try {
    const participantsRef = collection(
      db,
      "tournaments",
      tournamentId,
      "users",
    );

    const q = query(participantsRef);

    const snapshot: QuerySnapshot = await getDocs(q);

    const participants: ParticipantsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ParticipantsList;

    return participants;
  } catch (error) {
    console.error("Error fetching participants:", error);
    return [];
  }
};
