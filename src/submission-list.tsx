import { User } from "@firebase/auth";
import { limit, onSnapshot, onSnapshotsInSync, orderBy, query, where } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { Submission } from "./submission";
import { previousAnswersLimit } from "./App";
import { submissionCollection, firestore } from "./firestore";

export function useSubmissions(user: User, token: string | null) {
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);

  useEffect(() => {
    if (!user) return undefined;
    if (token === null) return undefined;
    return onSnapshot(
      query(
        submissionCollection,
        where("uid", "==", user.uid),
        where("token", "==", token),
        orderBy("time", "desc"),
        limit(previousAnswersLimit)
      ),
      (snapshot) => setSubmissions(snapshot.docs.map((doc) => doc.data()))
    );
  }, [token, user]);

  useEffect(
    () =>
      onSnapshotsInSync(firestore, () => {
        // If no snapshot was received, then there are no previous answers
        setSubmissions((x) => x ?? []);
      }),
    []
  );

  return submissions;
}
