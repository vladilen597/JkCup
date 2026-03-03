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
