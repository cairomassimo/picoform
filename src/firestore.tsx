import { collection, CollectionReference, doc, DocumentReference, getFirestore } from "@firebase/firestore";
import { Submission } from "./submission";
import { firebaseApp } from "./firebase-init";
import { Config } from "./App";

export const firestore = getFirestore(firebaseApp);
export const configDoc = doc(firestore, "config", "main") as DocumentReference<Config>;
export const submissionCollection = collection(firestore, "submissions") as CollectionReference<Submission>;
