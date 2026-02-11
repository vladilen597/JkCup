import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../utils/firebase";

interface Tournament {
  id: string;
  name: string;
  game: string;
  description: string;
  max_players: number;
}

const getAllTournaments = async (): Promise<Tournament[]> => {
  try {
    const q = query(collection(db, "tournaments"));
    const snapshot = await getDocs(q);

    const tournaments: Tournament[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Tournament[];

    return tournaments;
  } catch (error) {
    console.error("Failed to fetch tournaments:", error);
    throw error;
  }
};

export default getAllTournaments;
