import {
  IMatch,
  IRound,
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
    removeTournament: (state, action: PayloadAction<{ tournamentId }>) => {
      state.tournaments = state.tournaments.filter(
        (tournament) => tournament.id !== action.payload.tournamentId,
      );
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
        started_at?: string;
      }>,
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id === action.payload.tournamentId,
      );
      if (tournament) {
        tournament.status = action.payload.status;
        if (action.payload.started_at) {
          tournament.started_at = action.payload.started_at;
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

    addRound: (
      state,
      action: PayloadAction<{ tournamentId: string; round: IRound }>,
    ) => {
      const { tournamentId, round } = action.payload;
      const tournament = state.tournaments.find((t) => t.id === tournamentId);

      if (tournament) {
        if (!tournament.rounds) tournament.rounds = [];
        tournament.rounds.push(round);

        tournament.rounds.sort((a, b) => a.number - b.number);
      }
    },
    addMatch: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        roundId: string;
        match: IMatch;
      }>,
    ) => {
      const { tournamentId, roundId, match } = action.payload;

      const tournament = state.tournaments.find((t) => t.id === tournamentId);

      if (tournament && tournament.rounds) {
        const round = tournament.rounds.find((r) => r.id === roundId);

        if (round) {
          if (!round.matches) round.matches = [];
          round.matches.push(match);
        }
      }
    },
    removeMatch: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        roundId: string;
        matchId: string;
      }>,
    ) => {
      const { tournamentId, roundId, matchId } = action.payload;

      const tournament = state.tournaments.find((t) => t.id === tournamentId);

      if (tournament && tournament.rounds) {
        const round = tournament.rounds.find((r) => r.id === roundId);

        if (round) {
          round.matches = round.matches.filter((match) => match.id !== matchId);
        }
      }
    },
    removeMatchParticipant: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        roundId: string;
        matchId: string;
        participantRecordId: string;
      }>,
    ) => {
      const { tournamentId, roundId, matchId, participantRecordId } =
        action.payload;

      const tournament = state.tournaments.find((t) => t.id === tournamentId);
      const round = tournament?.rounds?.find((r) => r.id === roundId);
      const match = round?.matches?.find((m) => m.id === matchId);

      if (match) {
        match.participants = match.participants.filter(
          (p) => p.id !== participantRecordId,
        );
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
  },
});

export const {
  setTournaments,
  addTournament,
  updateTournament,
  removeTournament,

  addTournamentTeam,
  removeTeam,
  addTeamParticipant,
  updateTournamentStatus,
  removeTeamParticipant,
  setJudges,
  selectWinnerTeam,
  selectWinnerUser,
  removeJudge,
  updateTournamentStreamLink,

  addRound,
  addMatch,
  removeMatch,
  removeMatchParticipant,
} = tournamentsSlice.actions;

export default tournamentsSlice.reducer;
