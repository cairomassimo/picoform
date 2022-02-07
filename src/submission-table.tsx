import { FormattedMessage, FormattedTime } from "react-intl";
import { Submission } from "./submission";
import {Accordion, Alert, Button, ListGroup, Modal, Row} from "react-bootstrap";
import {useState} from "react";

export function SubmissionTable({
  submissions,
  numberOfQuestions,
}: {
  submissions: Submission[];
  numberOfQuestions: number;
}) {
  return (
    <div className="mb-5">
      <h2>
        <FormattedMessage defaultMessage="Recent submissions" id="submission-table-title" />
      </h2>
      {submissions.length === 0 && (
        <div className="mb-3">
          <FormattedMessage defaultMessage="No answers submitted." id="submission-table-empty-message" />
        </div>
      )}
      {submissions.length > 0 && (
        <Accordion className="mb-3 p-0">
          {submissions.map((x, submissionIndex) => (
            <Accordion.Item eventKey={submissionIndex.toString()} key={submissionIndex}>
              <Accordion.Header>
                <span className="me-3">#{submissions.length - submissionIndex}</span>
                {x.time === null && (
                    <FormattedMessage defaultMessage="Saving..." id="submission-table-pending-message" />
                )}
                {x.time !== null && (
                    <FormattedTime
                      value={x.time.toDate()}
                      dateStyle="medium"
                      timeStyle="medium"
                      fractionalSecondDigits={3}
                    />
                )}
              </Accordion.Header>
              <Accordion.Body>
                <ListGroup variant="flush">
                  {x.answers.map((answer, index) => (
                    <ListGroup.Item className="d-flex justify-content-between" key={index}>
                      <div className="w-50">
                        <FormattedMessage defaultMessage="Question" id="question" />
                        &nbsp;{index + 1}:
                      </div>
                      <div className="w-50">{answer}</div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
      <Alert variant="info">
        <FormattedMessage
          defaultMessage={`
NB: only the answers submitted <strong>from this browser</strong> are shown here.
<emph>The official submission is the most recent one, even if submitted from a different browser.</emph>
`}
          id="submission-footer-warning"
        />
      </Alert>
    </div>
  );
}
