import { collection, CollectionReference, doc, DocumentReference, getFirestore } from "@firebase/firestore";
import { Config } from "./config";
import { firebaseApp } from "./firebase-init";
import { Submission } from "./submission";

export const firestore = getFirestore(firebaseApp);
export const configDoc = doc(firestore, "config", "main") as DocumentReference<Config>;
export const submissionCollection = collection(firestore, "submissions") as CollectionReference<Submission>;
