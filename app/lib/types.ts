export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

export interface ITag {
  id: string;
  value: string;
  bgColor: string;
  textColor: string;
}

export interface INotification {
  id: string;
  title: string;
  text: string;
  created_at: string;
}

export interface IGame {
  id: string;
  name: string;
  image_url: string;
}

export interface IUser {
  id: string;
  full_name: string;
  image_url: string;
  email: string;
  created_at?: string;
  last_sign_in?: string;
  who_invited: string;
  role: "guest" | "user" | "admin" | "superadmin";
  games?: IGame[];
  status?: "blocked" | "active";

  discord_full_name?: string;
  discord_global_name?: string;
  discord_id?: string;
  discord_avatar?: string;

  steam_id?: string;
  steam_name?: string;
  steam_avatar?: string;
  steam_profile_url?: string;

  judged_tournaments: IJudgedTournament[];
}

interface IJudgedTournament {
  profile_id: string;
  tournament_id: string;
  tournament: ITournament;
}

export interface IBracket {
  rounds: {
    id: string;
    matches: {
      id: string;
      users: IUser[];
      info: string;
    }[];
  }[];
  currentRound: number;
  participants: IUser[];
}

export interface ITeamMember {
  id: string;
  joined_at: string;
  profile: IUser;
  profile_id: string;
  team_id: string;
}

export interface ITeam {
  name: string;
  creator_id: string;
  id: string;
  is_private: boolean;
  tournament_id: string;
  members: ITeamMember[];
}

export interface ITournamentRegistration {
  id: string;
  tournament_id: string;
  profile_id: string;
  registered_at: string;
  profile?: IUser;
}

export interface ITournamentJudge {
  tournament_id: string;
  profile_id: string;
  profile?: IUser;
}

export interface ITournament {
  id: string;
  name: string;
  game_id: string | null;
  game?: IGame | null;
  type: string;
  max_players: number | null;
  max_teams: number | null;
  players_per_team: number;
  description: string | null;
  rules: string | null;
  stream_link: string | null;
  status: string;
  creator_id: string;
  creator?: IUser;
  registrations?: ITournamentRegistration[];
  teams?: ITeam[];
  judges?: ITournamentJudge[];
  winner_user_id: string | null;
  winner_user?: IUser | null;
  winner_team_id: string | null;
  winner_team?: ITeam | null;

  // ВАЖНО: Заменяем bracket: IBracket на rounds
  rounds?: IRound[];

  rewards: { id: string; value: string }[] | null;
  tags: ITag[] | null;
  start_date: string | null;
  started_at: string | null;
  created_at: string;
  duration: number | null;
  hidden: boolean;
  is_bracket: boolean;
}

// Дополнительные интерфейсы для сетки
export interface IRound {
  id: string;
  tournament_id: string;
  number: number;
  name: string | null;
  matches: IMatch[]; // Проверь, что тут именно IMatch[]
}

export interface IMatch {
  id: string;
  round_id: string;
  status: string;
  next_match_id: string | null;
  winner_id: string | null;
  metadata: any | null; // Здесь можно хранить { info: string }
  participants: IMatchParticipant[];
}

export interface IMatchParticipant {
  id: string;
  match_id: string;
  slot: number;
  score: number;
  is_winner: boolean;
  profile_id: string | null;
  team_id: string | null;
  profile?: IUser; // Данные игрока из Prisma include
  team?: ITeam; // Данные команды из Prisma include
}
