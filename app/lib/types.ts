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
  discord: string;
  created_at?: string;
  last_sign_in?: string;
  steam_link?: string;
  steam_display_name?: string;
  role: "guest" | "user" | "admin" | "superadmin";
  games?: IGame[];
  status?: "blocked" | "active";
}
