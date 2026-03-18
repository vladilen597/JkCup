import { useEffect, useState } from "react";
import axios from "axios";

export const useTournamentStats = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [teamsCount, setTeamsCount] = useState(0);

  const handleGetTournaments = async () => {
    try {
      const { data } = await axios.get<{ users: number; teams: number }>(
        "/api/tournaments/stats",
      );
      setUsersCount(data.users);
      setTeamsCount(data.teams);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetTournaments();
  }, []);

  return { usersCount, teamsCount };
};
