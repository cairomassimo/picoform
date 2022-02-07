import { User } from "@firebase/auth";
import { addDoc, DocumentReference, serverTimestamp } from "@firebase/firestore";
import { useState } from "react";
import { Submission } from "./submission";
import { submissionCollection } from "./firestore";
import { FormattedMessage } from "react-intl";
import {Button, Col, Container, Form, Row} from "react-bootstrap";

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
    <Form
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
      <Container className="p-0">
        <Row xs="1" sm="2" md="3" lg="4" xxl="5">
          {Array.from({ length: numberOfQuestions }, (unused, i) => (
            <Col className="mb-3" key={i}>
              <Form.Group>
                <Form.Label>
                  Quesito {i + 1}
                </Form.Label>
                <Form.Control
                  disabled={nextSubmissionState !== null}
                  /* TODO: set custom validity with user-friendly error message. */
                  /* Strictly-positive integers with <= 50 digits */
                  pattern="[1-9][0-9]{0,49}"
                  defaultValue={lastSubmission?.answers?.[i] ?? ""}
                  placeholder={lastSubmission?.answers?.[i] ?? ""}
                  id={`a${i + 1}`}
                  name={`a${i + 1}`}
                 />
              </Form.Group>
            </Col>
          ))}
        </Row>
        <Row>
          <div className="mb-3">
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
        </Row>
        <Row>
          <div className="d-flex justify-content-center">
            <div>
              <Button
                className="me-3 mb-3"
                disabled={nextSubmissionState !== null}
                type="submit"
              >
                <FormattedMessage defaultMessage="Save answers" id="answers-submit-label" />
              </Button>
              <Button
                className="me-3 mb-3"
                variant="outline-primary"
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
              </Button>
            </div>
          </div>
        </Row>
      </Container>
    </Form>
  );
}

function getAnswers(numberOfQuestions: number, form: EventTarget & HTMLFormElement, lastSubmission: Submission | null) {
  return Array.from({ length: numberOfQuestions }, (unused, i) => {
    const input = form.elements.item(i) as HTMLInputElement;
    return [input.value || null, lastSubmission?.answers?.[i] ?? null];
  });
}
