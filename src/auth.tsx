import { getAuth, onAuthStateChanged, signInAnonymously, User } from "@firebase/auth";
import { useEffect, useState } from "react";
import { firebaseApp } from "./firebase-init";

const auth = getAuth(firebaseApp);

export function useAnonymousUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => onAuthStateChanged(auth, (user) => setUser(user)), []);
  useEffect(() => {
    signInAnonymously(auth);
  }, []);

  return user;
}
