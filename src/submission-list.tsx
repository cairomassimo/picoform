import { User } from "@firebase/auth";
import { limit, onSnapshot, orderBy, query, where } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { submissionCollection } from "./firestore";
import { previousAnswersLimit } from "./main";
import { Submission } from "./submission";

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

  return submissions;
}
