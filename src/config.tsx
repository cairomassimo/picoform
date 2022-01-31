import { onSnapshot } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { configDoc } from "./firestore";

export interface Config {
  numberOfQuestions?: number;
  canAnswer?: boolean;
  title?: string;
}

export function useAppConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  useEffect(() => onSnapshot(configDoc, (snapshot) => setConfig(snapshot.data() ?? {})), []);
  return config;
}
