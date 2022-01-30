import { User } from "@firebase/auth";
import { SubmissionForm } from "./submission-form";
import { SubmissionTable } from "./submission-table";
import { useSubmissions } from "./submission-list";
import { FormattedMessage } from "react-intl";

export function SubmissionPanel({
  numberOfQuestions,
  canAnswer,
  user,
  token,
}: {
  numberOfQuestions: number;
  canAnswer: boolean;
  user: User;
  token: string | null;
}) {
  const submissions = useSubmissions(user, token);
  const lastSubmission = submissions && submissions.length > 0 ? submissions[0] : null;

  return (
    <div>
      {!submissions && <FormattedMessage defaultMessage="Loading..." id="submissions-loading-message" />}
      {submissions && (
        <>
          {!canAnswer && <FormattedMessage defaultMessage="Cannot answer now." id="cannot-submit-message" />}
          {canAnswer && (
            <SubmissionForm
              user={user}
              token={token}
              numberOfQuestions={numberOfQuestions}
              lastSubmission={lastSubmission}
            />
          )}
          <SubmissionTable previousAnswers={submissions} numberOfQuestions={numberOfQuestions} />
        </>
      )}
    </div>
  );
}
