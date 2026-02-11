export interface Tournament {
  id: number;
  name: string;
  game: string;
  description: string;
  max_players: number;
}

export type TournamentsList = Tournament[];
