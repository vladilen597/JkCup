import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

interface Tournament {
  id: string;
  name: string;
  game: string;
  description: string;
  max_players: number;
}

const getTournament = async (id: string): Promise<Tournament | null> => {
  try {
    // doc() is synchronous, not async
    const docRef = doc(db, "tournaments", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Combine the document ID with the data
      return {
        id: docSnap.id,
        ...data,
      } as Tournament;
    } else {
      // Return null instead of empty object
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch tournament:", error);
    throw error;
  }
};

export default getTournament;
