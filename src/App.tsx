import { css } from "@emotion/css";
import { Submission } from "./submission";
import { SubmissionPanel } from "./submission-panel";
import { TokenForm, useTokenState } from "./token-form";
import { useAnonymousUser } from "./auth";
import { useAppConfig } from "./config";

export interface Config {
  numberOfQuestions?: number;
  canAnswer?: boolean;
}

export const previousAnswersLimit = 10;

export function App() {
  const config = useAppConfig();
  const user = useAnonymousUser();

  const tokenState = useTokenState();

  const numberOfQuestions = config?.numberOfQuestions;

  return (
    <div
      className={css`
        display: flex;
        flex-flow: column;
        max-width: 80rem;
        margin: 0 auto;
      `}
    >
      {(!user || !config) && <>Loading...</>}
      {user && config && (
        <>
          {numberOfQuestions === undefined && <>Not configured.</>}
          {numberOfQuestions !== undefined && (
            <>
              <TokenForm tokenState={tokenState} />
              <hr />
              {tokenState.token !== null && (
                <SubmissionPanel
                  canAnswer={config.canAnswer ?? false}
                  numberOfQuestions={numberOfQuestions}
                  user={user}
                  token={tokenState.token}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export function getAnswers(
  numberOfQuestions: number,
  form: EventTarget & HTMLFormElement,
  lastSubmission: Submission | null
) {
  return Array.from({ length: numberOfQuestions }, (unused, i) => {
    const input = form.elements.item(i) as HTMLInputElement;
    return [input.value || null, lastSubmission?.answers?.[i] ?? null];
  });
}
