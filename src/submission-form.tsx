import { css } from "@emotion/css";
import { User } from "@firebase/auth";
import { addDoc, DocumentReference, serverTimestamp } from "@firebase/firestore";
import { Fragment, useState } from "react";
import { Submission } from "./submission";
import { submissionCollection } from "./firestore";
import { FormattedMessage } from "react-intl";

export function SubmissionForm({
  user,
  token,
  numberOfQuestions,
  lastSubmission,
}: {
  user: User;
  token: string | null;
  numberOfQuestions: number;
  lastSubmission: Submission | null;
}) {
  const [nextSubmissionState, setNextSubmissionState] = useState<
    { status: "pending"; promise: Promise<DocumentReference> } | { status: "success" } | { status: "error" } | null
  >(null);

  const [pristine, setPristine] = useState(true);

  return (
    <form
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const promise = addDoc(submissionCollection, {
          uid: user.uid,
          token,
          time: serverTimestamp(),
          answers: getAnswers(numberOfQuestions, form, lastSubmission).map(
            ([current, previous]) => current ?? previous
          ),
        });
        setNextSubmissionState({ status: "pending", promise });
        form.reset();
        setPristine(true);

        promise.then(() => {
          setNextSubmissionState((previous) =>
            previous?.status === "pending" && previous.promise === promise ? { status: "success" } : previous
          );
        });
        promise.catch(() => {
          setNextSubmissionState((previous) =>
            previous?.status === "pending" && previous.promise === promise ? { status: "error" } : previous
          );
        });
      }}
      onChange={(event) => {
        const form = event.currentTarget;
        setPristine(
          getAnswers(numberOfQuestions, form, lastSubmission).every(([current, previous]) => current === previous)
        );
      }}
    >
      <div
        className={css`
          display: grid;
          grid: auto-flow 3rem / repeat(auto-fit, minmax(14rem, auto));
          gap: 0.5rem 1rem;
          padding: 2rem 1rem;
          overflow: auto;
        `}
      >
        {Array.from({ length: numberOfQuestions }, (unused, i) => (
          <Fragment key={i}>
            <label
              className={css`
                display: flex;
                gap: 0.25rem;
              `}
            >
              <span
                className={css`
                  width: 2rem;
                  align-self: center;
                  text-align: right;
                `}
              >
                Q{i + 1}
              </span>
              <input
                className={css`
                  flex: 1;
                  width: 100%;
                  padding: 0.5rem;
                  font-size: 1.5rem;
                  font-weight: bold;
                `}
                disabled={nextSubmissionState !== null}
                pattern="-?\d+"
                defaultValue={lastSubmission?.answers?.[i] ?? ""}
                placeholder={lastSubmission?.answers?.[i] ?? ""}
                id={`a${i + 1}`}
                name={`a${i + 1}`}
              />
            </label>
          </Fragment>
        ))}
      </div>
      <div
        className={css`
          display: flex;
          justify-content: center;
        `}
      >
        <div
          className={css`
            flex: 1;
            max-width: 32rem;
            margin: 1rem;
          `}
        >
          <div
            className={css`
              display: flex;
              gap: 1rem;
            `}
          >
            <button
              className={css`
                width: 100%;
                padding: 1.5rem;
                font-size: 1.5rem;
              `}
              disabled={nextSubmissionState !== null}
              type="submit"
            >
              <FormattedMessage defaultMessage="Save answers" id="answers-submit-label" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                setNextSubmissionState(null);
                event.currentTarget.form!.reset();
              }}
              disabled={!nextSubmissionState}
            >
              {nextSubmissionState?.status === "error" ? (
                <FormattedMessage defaultMessage="Try again" id="answers-retry-label" />
              ) : (
                <FormattedMessage defaultMessage="Changes answers" id="answers-change-label" />
              )}
            </button>
          </div>
          <div>
            {!nextSubmissionState && pristine && (
              <FormattedMessage defaultMessage="No answer was changed" id="submission-status-pristine" />
            )}
            {!nextSubmissionState && !pristine && (
              <FormattedMessage defaultMessage="Answers NOT saved yet" id="submission-status-unsubmitted" />
            )}
            {nextSubmissionState?.status === "pending" && (
              <FormattedMessage defaultMessage="Saving answers..." id="submission-status-pending-message" />
            )}
            {nextSubmissionState?.status === "success" && (
              <FormattedMessage defaultMessage="Answers saved!" id="submission-status-success-message" />
            )}
            {nextSubmissionState?.status === "error" && (
              <FormattedMessage
                defaultMessage="An error occurred. Answers NOT saved."
                id="submission-status-error-message"
              />
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

function getAnswers(numberOfQuestions: number, form: EventTarget & HTMLFormElement, lastSubmission: Submission | null) {
  return Array.from({ length: numberOfQuestions }, (unused, i) => {
    const input = form.elements.item(i) as HTMLInputElement;
    return [input.value || null, lastSubmission?.answers?.[i] ?? null];
  });
}
