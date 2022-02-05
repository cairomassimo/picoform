import { Timestamp } from "@firebase/firestore";

export interface Announcement {
  time?: Timestamp;
  title?: string;
  content?: string;
  severity?: "danger" | "warning" | "info";
}
