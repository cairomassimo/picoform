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
  token: string;
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
          columns: 4 16rem;
          column-gap: 1rem;
          margin: 1rem 0;
          padding: 1rem;
          overflow: auto;
          background: rgba(0 0 0 / 5%);
        `}
      >
        {Array.from({ length: numberOfQuestions }, (unused, i) => (
          <Fragment key={i}>
            <label
              className={css`
                display: flex;
                break-inside: avoid;
                gap: 0.25rem;
                padding: 0.25rem 0;
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
                /* TODO: set custom validity with user-friendly error message. */
                /* Strictly-positive integers with <= 50 digits */
                pattern="[1-9][0-9]{0,49}"
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
        `}
      >
        <div
          className={css`
            flex: 1;
            max-width: 32rem;
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
                <FormattedMessage defaultMessage="Change answers" id="answers-change-label" />
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
