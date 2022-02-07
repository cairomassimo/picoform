import { FormattedMessage, FormattedTime } from "react-intl";
import { Submission } from "./submission";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";

export function SubmissionTable({
  submissions,
  numberOfQuestions,
}: {
  submissions: Submission[];
  numberOfQuestions: number;
}) {
  return (
    <div>
      <h2>
        <FormattedMessage defaultMessage="Recent submissions" id="submission-table-title" />
      </h2>
      {submissions.length === 0 && (
        <div className="mb-3">
          <FormattedMessage defaultMessage="No answers submitted." id="submission-table-empty-message" />
        </div>
      )}
      {/* <div>
          <table>
            <thead>
              <tr>
                <th>
                  <FormattedMessage defaultMessage="Saved at" id="submission-table-time-header" />
                </th>
                <th>
                  <FormattedMessage defaultMessage="Answers" id="submission-table-answers-header" />
                </th>
              </tr>
              <tr>
                {Array.from({ length: numberOfQuestions }, (unused, i) => (
                  <th>
                    Q{i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map((x, submissionIndex) => (
                <tr>
                  <th>
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
                  </th>
                  {Array.from({ length: numberOfQuestions }, (unused, i) => (
                    <td key={i} >
                      <output>
                        {(x.answers[i] ?? "") || <i>-</i>}
                      </output>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      {submissions.length > 0 && (
        <Container className="mb-3">
          {submissions.map((x, submissionIndex) => (
            <Row className="mb-3">
              <Col>
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
              </Col>
              <Col>
                <Button>
                  Mostra
                </Button>
              </Col>
            </Row>
          ))}
        </Container>
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
