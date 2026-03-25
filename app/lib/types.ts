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
  is_active: boolean;
  priority: number;
  type: "info" | "warning";
}

export interface IUserNotification {
  id: string;
  user_id: string;
  is_read: boolean;
  read_at: null | string;
  notification: INotification;
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

export interface IArchivedTournament {
  id: string;
  name: string;
  type: "single" | "team";
  max_players?: number | null;
  max_teams?: number | null;
  players_per_team: number;
  description?: string | null;
  start_date?: string | Date | null;
  status: "archived";
  duration?: number | null;
  rules?: string | null;
  stream_link?: string | null;
  rewards?: any;
  tags?: any;

  judges: IArchivedJudge[];

  game_snapshot?: {
    id: string;
    name: string;
    image_url?: string;
  } | null;

  creator_snapshot?: {
    id: string;
    name: string;
  } | null;

  winner_user_id?: string | null;
  winner_user?: IUser | null;

  winner_team_id?: string | null;
  winner_team?: IArchivedTeam | null;

  teams: IArchivedTeam[];
  registrations: IArchivedParticipant[];

  started_at?: string | Date | null;
  created_at: string | Date;
  archived_at: string | Date;
}

export interface IArchivedJudge {
  id: string;
  tournament_id: string;
  user_id: string;
  profile: IUser;
}

export interface IArchivedTeam {
  id: string;
  tournament_id: string;
  name: string;

  members: IArchivedParticipant[];
}

export interface IArchivedParticipant {
  id: string;
  tournament_id: string;
  user_id: string;
  team_id?: string | null;
  team_name?: string | null;
  is_winner: boolean;

  profile: IUser;
}

export interface IRound {
  id: string;
  tournament_id: string;
  number: number;
  name: string | null;
  matches: IMatch[];
}

export interface IMatch {
  id: string;
  round_id: string;
  status: string;
  next_match_id: string | null;
  winner_id: string | null;
  metadata: any | null;
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
  profile?: IUser;
  team?: ITeam;
}

export interface IGlobalPoll {
  id: string;
  title: string;
  is_active: boolean;
  ends_at: string;
  created_at: string;
  options: IPollOption[];
  votes: IVote[];
}

export interface IPollOption {
  id: string;
  poll_id: string;
  game_id: string;
  game: IGame;
}

export interface IVote {
  poll_id: string;
  profile_id: string;
  game_id: string;
  updated_at: string;
}
