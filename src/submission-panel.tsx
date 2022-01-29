import { User } from "@firebase/auth";
import { SubmissionForm } from "./submission-form";
import { SubmissionTable } from "./submission-table";
import { useSubmissions } from "./submission-list";

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
      {!submissions && <>Loading...</>}
      {submissions && (
        <>
          {!canAnswer && <>Cannot answer now.</>}
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
