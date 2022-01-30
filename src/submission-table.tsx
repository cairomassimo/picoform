import { css, cx } from "@emotion/css";
import { FormattedMessage } from "react-intl";
import { Submission } from "./submission";

export function SubmissionTable({
  submissions,
  numberOfQuestions,
}: {
  submissions: Submission[];
  numberOfQuestions: number;
}) {
  return (
    <>
      <h2>
        <FormattedMessage defaultMessage="Recent submissions" id="submission-table-title" />
      </h2>
      {submissions.length === 0 && (
        <FormattedMessage defaultMessage="Recent submissions" id="submission-table-empty-message" />
      )}
      {submissions.length > 0 && (
        <div
          className={css`
            display: flex;
            flex-flow: column;
            overflow: auto;
          `}
        >
          <table
            className={css`
              table-layout: fixed;
              border-collapse: collapse;
            `}
          >
            <thead
              className={css`
                border-bottom: 2px solid black;
              `}
            >
              <tr>
                <th />
                <th
                  className={css`
                    text-align: center;
                  `}
                  colSpan={numberOfQuestions}
                >
                  <FormattedMessage defaultMessage="Answers" id="submission-table-answers-header" />
                </th>
              </tr>
              <tr>
                <th
                  className={css`
                    padding: 0.5rem;
                    text-align: center;
                  `}
                >
                  <FormattedMessage defaultMessage="Saved at" id="submission-table-time-header" />
                </th>
                {Array.from({ length: numberOfQuestions }, (unused, i) => (
                  <th
                    className={css`
                      padding: 0.5rem;
                      text-align: right;
                    `}
                    key={i}
                    rowSpan={2}
                  >
                    Q{i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map((x, submissionIndex) => (
                <tr
                  className={css`
                    td {
                      padding: 0.25rem 0.5rem;
                      font-weight: bold;
                      text-align: right;
                    }

                    td.placeholder-answer {
                      font-weight: unset;
                      color: #666666;
                    }

                    &:nth-child(2n) {
                      background: #eeeeee;
                    }
                  `}
                  key={submissionIndex}
                >
                  <th
                    className={css`
                      white-space: nowrap;
                    `}
                  >
                    {x.time === null && (
                      <FormattedMessage defaultMessage="Saving..." id="submission-table-pending-message" />
                    )}
                    {x.time !== null && <>{x.time.toDate().toLocaleString()}</>}
                  </th>
                  {Array.from({ length: numberOfQuestions }, (unused, i) => (
                    <td
                      className={cx(
                        "answer",
                        submissionIndex > 0 &&
                          x.answers[i] === submissions[submissionIndex - 1].answers[i] &&
                          "placeholder-answer"
                      )}
                      key={i}
                    >
                      <output>
                        {/* TODO: highlight answers that differ from previous  */}
                        {(x.answers[i] ?? "") || <i>-</i>}
                      </output>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p>
        <FormattedMessage
          defaultMessage={`
NB: only the answers submitted <strong>from this browser</strong> are shown here.
<emph>The official submission is the most recent one, even if submitted from a different browser.</emph>
`}
          id="submission-footer-warning"
        />
      </p>
    </>
  );
}
