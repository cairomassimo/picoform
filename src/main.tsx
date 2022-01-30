import { css } from "@emotion/css";
import { FormattedMessage } from "react-intl";
import { useAnonymousUser } from "./auth";
import { useAppConfig } from "./config";
import { Submission } from "./submission";
import { SubmissionPanel } from "./submission-panel";
import { TokenForm, useTokenState } from "./token-form";

export interface Config {
  numberOfQuestions?: number;
  canAnswer?: boolean;
}

export const previousAnswersLimit = 10;

export function Main() {
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
      {(!user || !config) && <FormattedMessage defaultMessage="Loading..." id="loading" />}
      {user && config && (
        <>
          {numberOfQuestions === undefined && <FormattedMessage defaultMessage="Not configured." id="not-configured" />}
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
