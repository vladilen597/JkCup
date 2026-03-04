import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "./userSlice";
import { ISelectOption } from "@/app/components/Shared/CustomSelect/CustomSelect";
import { ITag } from "@/app/lib/types";

export interface IBracket {
  rounds: {
    id: string;
    matches: {
      id: string;
      users: IUser[];
      score: string;
    }[];
  }[];
  currentRound: number;
  participants: IUser[];
}

export interface ITournament {
  id: string;
  game: string;
  max_players: number;
  name: string;
  usersIds: string[];
  type: ISelectOption;
  max_teams: number;
  players_per_team: number;
  description: string;
  start_date: string;
  status: string;
  teams: ITeam[];
  tags: ITag[];
  duration: number;
  judgesIds: string[];
  winner_team: ITeam | null;
  winner_user: IUser | null;
  rewards: { id: string; value: string }[];
  creator?: IUser;
  createdAt?: string;
  startedAt?: string;
  bracket: IBracket;
  hidden?: boolean;
}

export interface IRound {
  id: string;
  matches: any[];
}

export interface ITeam {
  uid: string;
  creator_uid: string;
  name?: string;
  usersIds: string[];
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
          usersIds: [currentUser.uid],
        });
      }
    },
    addJudge: (
      state,
      action: PayloadAction<{ tournamentId: string; userId: string }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );
      tournament?.judgesIds.push(action.payload.userId);
    },
    removeJudge: (
      state,
      action: PayloadAction<{ tournamentId: string; userId: string }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );
      if (tournament) {
        tournament.judgesIds = tournament.judgesIds.filter(
          (judgeId) => judgeId !== action.payload.userId,
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
        tournament.usersIds = tournament.usersIds.filter(
          (userArrayId) => userArrayId !== action.payload.userId,
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
        userUid: string;
      }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );

      if (tournament) {
        const team = tournament.teams.find(
          (team) => team.uid === action.payload.teamId,
        );
        team?.usersIds.push(action.payload.userUid);
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
        if (!tournament.usersIds.includes(participant.uid)) {
          tournament.usersIds.push(participant.uid);
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
        tournament.usersIds = tournament.usersIds.filter(
          (userArrayId) => userArrayId !== userId,
        );
      }
    },
    updateBracketUser: (state, action) => {
      const { tournamentId, roundId, matchId, index, user } = action.payload;
      const tournament = state.tournaments.find((t) => t.id === tournamentId);
      if (tournament?.bracket) {
        const round = tournament.bracket.rounds.find((r) => r.id === roundId);
        const match = round?.matches.find((m) => m.id === matchId);

        if (match) {
          if (!match.users) match.users = [];

          if (user === null) {
            // Deletes the user and shifts the array (removes the "hole")
            match.users.splice(index, 1);
          } else {
            // If index is match.users.length, this appends automatically
            match.users[index] = user;
          }
        }
      }
    },
    advanceWinner: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        roundIndex: number;
        matchIndex: number;
        teamUsers: IUser[]; // Changed from winner: IUser
      }>,
    ) => {
      const { tournamentId, roundIndex, matchIndex, teamUsers } =
        action.payload;
      const tournament = state.tournaments.find((t) => t.id === tournamentId);

      if (tournament?.bracket?.rounds) {
        const nextRoundIndex = roundIndex + 1;
        const nextMatchIndex = Math.floor(matchIndex / 2);
        const nextSlotIndex = matchIndex % 2;

        if (tournament.bracket.rounds[nextRoundIndex]) {
          const nextMatch =
            tournament.bracket.rounds[nextRoundIndex].matches[nextMatchIndex];
          if (nextMatch) {
            // In a team-based bracket, we likely need to handle the users
            // as a nested structure or a specific slice of the array.
            // For simplicity, we'll store the advancing team at the calculated index.
            if (!nextMatch.users) nextMatch.users = [];

            // This logic assumes nextMatch.users[0] is Team A and [1] is Team B
            // You might need to adjust this depending on if 'users' is a flat
            // list or a list of team objects.
            nextMatch.users[nextSlotIndex] = teamUsers as any;
          }
        }
      }
    },
    addRound: (
      state,
      action: PayloadAction<{ tournamentId: string; round: IRound }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );

      if (tournament) {
        if (!tournament.bracket) {
          tournament.bracket = {
            rounds: [],
            currentRound: 0,
            participants: [],
          };
        }

        if (!Array.isArray(tournament.bracket.rounds)) {
          tournament.bracket.rounds = [];
        }

        tournament.bracket.rounds.push(action.payload.round);
      }
    },
    removeRound: (
      state,
      action: PayloadAction<{ tournamentId: string; roundId: string }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );

      if (tournament?.bracket?.rounds) {
        tournament.bracket.rounds = tournament.bracket.rounds.filter(
          (round) => round.id !== action.payload.roundId,
        );
      }
    },
    addMatchToRound: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        roundIndex: number;
        newMatch: any;
      }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );

      if (tournament && tournament.bracket?.rounds[action.payload.roundIndex]) {
        const round = tournament.bracket.rounds[action.payload.roundIndex];
        round.matches.push(action.payload.newMatch);
      }
    },
    removeMatchFromRound: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        roundId: string;
        matchId: string;
      }>,
    ) => {
      const { tournamentId, roundId, matchId } = action.payload;
      const tournament = state.tournaments.find((t) => t.id === tournamentId);

      if (tournament?.bracket?.rounds) {
        const round = tournament.bracket.rounds.find((r) => r.id === roundId);
        if (round) {
          round.matches = round.matches.filter((m) => m.id !== matchId);
        }
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
  removeRound,
  addMatchToRound,
  advanceWinner,
  removeMatchFromRound,
} = tournamentsSlice.actions;

export default tournamentsSlice.reducer;
