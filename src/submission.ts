import { Timestamp } from "@firebase/firestore";

export interface Submission {
  time: Timestamp;
  uid: string;
  token: string;
  answers: string[];
}
