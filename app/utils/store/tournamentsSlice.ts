import {
  ITeam,
  ITeamMember,
  ITournament,
  ITournamentJudge,
  IUser,
} from "@/app/lib/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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
    addTournament: (state, action: PayloadAction<ITournament>) => {
      state.tournaments.unshift(action.payload);
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
    updateTournamentStreamLink: (
      state,
      action: PayloadAction<{ tournamentId: string; link: string }>,
    ) => {
      state.tournaments = state.tournaments.map((tournament) => {
        if (tournament.id === action.payload.tournamentId) {
          return { ...tournament, stream_link: action.payload.link };
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
          tournament.started_at = action.payload.startedAt;
        }
      }
    },
    addTournamentTeam: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        team: ITeam;
      }>,
    ) => {
      const { tournamentId, team } = action.payload;

      const tournament = state.tournaments.find((t) => t.id === tournamentId);

      if (tournament) {
        if (!tournament.teams) tournament.teams = [];
        tournament.teams.push(team);
      }
    },

    setJudges: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        judges: ITournamentJudge[];
      }>,
    ) => {
      const { tournamentId, judges } = action.payload;
      const tournament = state.tournaments.find((t) => t.id === tournamentId);

      if (tournament) {
        tournament.judges = judges;
      }
    },
    removeJudge: (
      state,
      action: PayloadAction<{ tournamentId: string; judgeId: string }>,
    ) => {
      const { tournamentId, judgeId } = action.payload;
      const tournament = state.tournaments.find((t) => t.id === tournamentId);
      if (tournament) {
        tournament.judges = tournament.judges.filter(
          (judge) => judge.profile_id !== judgeId,
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
      const { tournamentId, teamId } = action.payload;
      const tournament = state.tournaments.find((t) => t.id === tournamentId);
      if (tournament) {
        tournament.teams = tournament.teams.filter(
          (team) => team.id !== teamId,
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
    addTeamParticipant: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        teamId: string;
        member: ITeamMember;
      }>,
    ) => {
      const { tournamentId, teamId, member } = action.payload;
      const tournament = state.tournaments.find((t) => t.id === tournamentId);
      const team = tournament?.teams.find((t) => t.id === teamId);
      if (team) {
        team.members.push(member);
      }
    },

    removeTeamParticipant: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        teamId: string;
        userId: string;
      }>,
    ) => {
      const { tournamentId, teamId, userId } = action.payload;
      const tournament = state.tournaments.find((t) => t.id === tournamentId);
      const team = tournament?.teams.find((t) => t.id === teamId);
      if (team) {
        team.members = team.members.filter((m) => m.profile_id !== userId);
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
  addTournament,
  addTournamentTeam,
  addParticipant,
  removeTeam,
  addTeamParticipant,
  updateTournament,
  updateTournamentStatus,
  removeParticipant,
  removeTeamParticipant,
  setJudges,
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
  updateTournamentStreamLink,
} = tournamentsSlice.actions;

export default tournamentsSlice.reducer;
