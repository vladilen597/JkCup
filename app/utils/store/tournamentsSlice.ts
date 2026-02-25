import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "./userSlice";
import { ISelectOption } from "@/app/components/Shared/CustomSelect/CustomSelect";

export interface ITournament {
  id: string;
  game: string;
  max_players: number;
  name: string;
  users: IUser[];
  type: ISelectOption;
  max_teams: number;
  players_per_team: number;
  description: string;
  start_date: string;
  status: string;
  teams: ITeam[];
  duration: number;
  judges: IUser[];
  winner_team: ITeam | null;
  winner_user: IUser | null;
  rewards: { id: string; value: string }[];
  creator?: IUser;
  createdAt?: string;
  startedAt?: string;
  bracket?: {
    rounds: Array<{
      id: string;
      matches: Array<{
        id: string;
        player1?: IUser | null;
        player2?: IUser | null;
        winner?: IUser | null;
        score?: string;
      }>;
    }>;
    currentRound: number;
    participants: IUser[];
  };
}

export interface ITeam {
  uid: string;
  creator_uid: string;
  name?: string;
  users: IUser[];
  is_private: boolean;
}

const initialState: { tournaments: ITournament[] } = {
  tournaments: [],
};

const tournamentsSlice = createSlice({
  name: "tournaments",
  initialState,
  reducers: {
    setTournaments: (state, action: PayloadAction<ITournament[]>) => {
      state.tournaments = action.payload;
    },
    updateTournament: (state, action: PayloadAction<ITournament>) => {
      state.tournaments = state.tournaments.map((tournament) => {
        if (tournament.id === action.payload.id) {
          return action.payload;
        } else {
          return tournament;
        }
      });
    },
    updateTournamentStatus: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        status: string;
        startedAt?: string;
      }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );
      if (tournament) {
        tournament.status = action.payload.status;
        if (action.payload.startedAt) {
          tournament.startedAt = action.payload.startedAt;
        }
      }
    },
    addTournamentTeam: (
      state,
      action: PayloadAction<{
        uid: string;
        tournamentId: string;
        teamName: string;
        currentUser: IUser;
        is_private: boolean;
      }>,
    ) => {
      const { uid, tournamentId, teamName, is_private, currentUser } =
        action.payload;
      const tournament = state.tournaments.find((t) => t.id === tournamentId);
      if (tournament) {
        tournament.teams.push({
          uid,
          name: teamName,
          is_private,
          creator_uid: currentUser.uid,
          users: [currentUser],
        });
      }
    },
    addJudge: (
      state,
      action: PayloadAction<{ tournamentId: string; user: IUser }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );
      tournament?.judges.push(action.payload.user);
    },
    removeJudge: (
      state,
      action: PayloadAction<{ tournamentId: string; userId: string }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );
      if (tournament) {
        tournament.judges = tournament.judges.filter(
          (judge) => judge.uid !== action.payload.userId,
        );
      }
    },
    selectWinnerTeam: (
      state,
      action: PayloadAction<{ team: ITeam; tournamentId: string }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );
      if (tournament) {
        tournament.winner_team = action.payload.team;
        tournament.status = "finished";
      }
    },
    selectWinnerUser: (
      state,
      action: PayloadAction<{ user: IUser; tournamentId: string }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );
      if (tournament) {
        tournament.winner_user = action.payload.user;
        tournament.status = "finished";
      }
    },
    removeTeam: (
      state,
      action: PayloadAction<{ tournamentId: string; teamId: string }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );

      if (tournament) {
        tournament.teams = tournament.teams.filter(
          (team) => team.uid !== action.payload.teamId,
        );
      }
    },
    removeUserFromSingleTournament: (
      state,
      action: PayloadAction<{ tournamentId: string; userId: string }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );
      if (tournament) {
        tournament.users = tournament.users.filter(
          (user) => user.uid !== action.payload.userId,
        );
      }
    },
    removeTeamParticipant: (
      state,
      action: PayloadAction<{ tournamentId: string; updatedTeams: ITeam[] }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );

      if (tournament) {
        tournament.teams = action.payload.updatedTeams;
      }
    },
    addTeamParticipant: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        teamId: string;
        user: IUser;
      }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );

      if (tournament) {
        const team = tournament.teams.find(
          (team) => team.uid === action.payload.teamId,
        );
        team?.users.push(action.payload.user);
      }
    },
    addParticipant: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        participant: IUser;
      }>,
    ) => {
      const { tournamentId, participant } = action.payload;
      const tournament = state.tournaments.find((t) => t.id === tournamentId);
      if (tournament) {
        if (!tournament.users.some((u) => u.uid === participant.uid)) {
          tournament.users.push(participant);
        }
      }
    },
    removeParticipant: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        userId: string;
      }>,
    ) => {
      const { tournamentId, userId } = action.payload;
      const tournament = state.tournaments.find((t) => t.id === tournamentId);
      if (tournament) {
        tournament.users = tournament.users.filter((u) => u.uid !== userId);
      }
    },
    updateBracketUser: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        roundId: string;
        matchId: string;
        slot: "player1" | "player2";
        user: IUser | null;
      }>,
    ) => {
      const { tournamentId, roundId, matchId, slot, user } = action.payload;
      const tournament = state.tournaments.find((t) => t.id === tournamentId);

      if (tournament && tournament.bracket) {
        const round = tournament.bracket.rounds.find((r) => r.id === roundId);
        if (round) {
          const match = round.matches.find((m) => m.id === matchId);
          if (match) {
            // Dynamically update player1 or player2
            match[slot] = user;
          }
        }
      }
    },
    addRound: (state, action: PayloadAction<{ tournamentId: string }>) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );

      if (tournament) {
        // 1. Ensure bracket exists
        if (!tournament.bracket) {
          tournament.bracket = {
            rounds: [],
            currentRound: 0,
            participants: [],
          };
        }

        // 2. CRITICAL FIX: Ensure rounds is actually an array
        // If it's an object or null, reset it to an empty array
        if (!Array.isArray(tournament.bracket.rounds)) {
          tournament.bracket.rounds = [];
        }

        const newRoundIndex = tournament.bracket.rounds.length;

        // 3. Now .push() will definitely work
        tournament.bracket.rounds.push({
          id: `Раунд ${newRoundIndex + 1}`,
          matches: [],
        });
      }
    },

    // Adds a match to a specific round
    addMatchToRound: (
      state,
      action: PayloadAction<{ tournamentId: string; roundIndex: number }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );
      if (tournament && tournament.bracket?.rounds[action.payload.roundIndex]) {
        const round = tournament.bracket.rounds[action.payload.roundIndex];
        round.matches.push({
          id: `match-${round.matches.length}-${Date.now()}`,
          player1: null,
          player2: null,
          winner: null,
        });
      }
    },
  },
});

export const {
  setTournaments,
  addTournamentTeam,
  addParticipant,
  removeTeam,
  addTeamParticipant,
  updateTournament,
  updateTournamentStatus,
  removeParticipant,
  removeTeamParticipant,
  addJudge,
  selectWinnerTeam,
  selectWinnerUser,
  removeUserFromSingleTournament,
  removeJudge,
  updateBracketUser,
  addRound,
  addMatchToRound,
} = tournamentsSlice.actions;

export default tournamentsSlice.reducer;
