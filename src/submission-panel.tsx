import { css } from "@emotion/css";
import { User } from "@firebase/auth";
import { FormattedMessage } from "react-intl";
import { SubmissionForm } from "./submission-form";
import { useSubmissions } from "./submission-list";
import { SubmissionTable } from "./submission-table";

export function SubmissionPanel({
  numberOfQuestions,
  canAnswer,
  user,
  token,
}: {
  numberOfQuestions: number;
  canAnswer: boolean;
  user: User;
  token: string;
}) {
  const submissions = useSubmissions(user, token);
  const lastSubmission = submissions && submissions.length > 0 ? submissions[0] : null;

  return (
    <>
      {!submissions && <FormattedMessage defaultMessage="Loading..." id="submissions-loading-message" />}
      {submissions && (
        <>
          <section
            className={css`
              margin: 1rem 0;
            `}
          >
            <h2>
              <FormattedMessage defaultMessage="Send your answers" id="submission-form-title" />
            </h2>
            {!canAnswer && <FormattedMessage defaultMessage="Cannot answer now." id="cannot-submit-message" />}
            {canAnswer && (
              <SubmissionForm
                user={user}
                token={token}
                numberOfQuestions={numberOfQuestions}
                lastSubmission={lastSubmission}
              />
            )}
          </section>
          <SubmissionTable submissions={submissions} numberOfQuestions={numberOfQuestions} />
        </>
      )}
    </>
  );
}
