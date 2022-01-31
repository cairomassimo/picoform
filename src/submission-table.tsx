import { css, cx } from "@emotion/css";
import { FormattedMessage, FormattedTime } from "react-intl";
import { Submission } from "./submission";

export function SubmissionTable({
  submissions,
  numberOfQuestions,
}: {
  submissions: Submission[];
  numberOfQuestions: number;
}) {
  return (
    <section
      className={css`
        margin: 1rem 0;
      `}
    >
      <h2>
        <FormattedMessage defaultMessage="Recent submissions" id="submission-table-title" />
      </h2>
      {submissions.length === 0 && (
        <FormattedMessage defaultMessage="No answers submitted." id="submission-table-empty-message" />
      )}
      {submissions.length > 0 && (
        <div
          className={css`
            display: flex;
            flex-flow: column;
            overflow: auto;
            margin: 0 -1rem;
            padding: 0 1rem;
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
                background: rgb(0 0 0 / 5%);
              `}
            >
              <tr>
                <th
                  className={css`
                    padding: 0.5rem;
                    text-align: left;
                    vertical-align: bottom;
                  `}
                  rowSpan={2}
                >
                  <FormattedMessage defaultMessage="Saved at" id="submission-table-time-header" />
                </th>
                <th
                  className={css`
                    text-align: left;
                    padding: 0.5rem;
                  `}
                  colSpan={numberOfQuestions}
                >
                  <FormattedMessage defaultMessage="Answers" id="submission-table-answers-header" />
                </th>
              </tr>
              <tr>
                {Array.from({ length: numberOfQuestions }, (unused, i) => (
                  <th
                    className={css`
                      padding: 0.5rem;
                      text-align: right;
                    `}
                    key={i}
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
                      color: rgb(0 0 0 / 60%);
                    }

                    &:nth-child(2n) {
                      background: rgb(0 0 0 / 5%);
                    }
                  `}
                  key={submissionIndex}
                >
                  <th
                    className={css`
                      padding: 0.25rem 0.5rem;
                      white-space: nowrap;
                      text-align: left;
                    `}
                  >
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
    </section>
  );
}
