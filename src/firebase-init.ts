import { connectAuthEmulator, getAuth } from "@firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "@firebase/firestore";
import firebaseApp from "./firebase-config";

if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(getFirestore(firebaseApp), "localhost", 8080);
  connectAuthEmulator(getAuth(firebaseApp), "http://localhost:9099", {
    disableWarnings: true,
  });
}

export { firebaseApp };
