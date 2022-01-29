import { css } from "@emotion/css";
import { User } from "@firebase/auth";
import {
  addDoc,
  DocumentReference, serverTimestamp
} from "@firebase/firestore";
import { Fragment, useState } from "react";
import { Submission } from "./submission";
import { getAnswers } from "./App";
import { submissionCollection } from "./firestore";

export function SubmissionForm({
  user, token, numberOfQuestions, lastSubmission,
}: {
  user: User;
  token: string | null;
  numberOfQuestions: number;
  lastSubmission: Submission | null;
}) {
  const [nextSubmissionState, setNextSubmissionState] = useState<
    { status: "pending"; promise: Promise<DocumentReference>; } | { status: "success"; } | { status: "error"; } | null
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
          setNextSubmissionState((previous) => previous?.status === "pending" && previous.promise === promise ? { status: "success" } : previous
          );
        });
        promise.catch(() => {
          setNextSubmissionState((previous) => previous?.status === "pending" && previous.promise === promise ? { status: "error" } : previous
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
                name={`a${i + 1}`} />
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
              Save answers
            </button>
            <button
              type="button"
              onClick={(event) => {
                setNextSubmissionState(null);
                event.currentTarget.form!.reset();
              }}
              disabled={!nextSubmissionState}
            >
              {nextSubmissionState?.status === "error" ? <>Retry</> : <>Change answers</>}
            </button>
          </div>
          <div>
            {!nextSubmissionState && pristine && <>No answer was changed</>}
            {!nextSubmissionState && !pristine && <>Answers NOT saved yet</>}
            {nextSubmissionState?.status === "pending" && <>Saving answers...</>}
            {nextSubmissionState?.status === "success" && <>Answers saved!</>}
            {nextSubmissionState?.status === "error" && <>An error occurred. Answers NOT saved.</>}
          </div>
        </div>
      </div>
    </form>
  );
}
