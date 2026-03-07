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
  description: string;
  created_at: FirestoreTimestamp;
}
