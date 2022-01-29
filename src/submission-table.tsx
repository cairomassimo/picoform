import { css, cx } from "@emotion/css";
import { Submission } from "./submission";

export function SubmissionTable({
  previousAnswers,
  numberOfQuestions,
}: {
  previousAnswers: Submission[];
  numberOfQuestions: number;
}) {
  return (
    <>
      <h2>Recent submissions</h2>
      {previousAnswers.length === 0 && <>No submissions.</>}
      {previousAnswers.length > 0 && (
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
                  Answers
                </th>
              </tr>
              <tr>
                <th
                  className={css`
                    padding: 0.5rem;
                    text-align: center;
                  `}
                >
                  Saved at
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
              {previousAnswers.map((x, answerIndex) => (
                <tr
                  className={css`
                    td {
                      padding: 0.25rem 0.5rem;
                      font-weight: bold;
                      text-align: right;
                    }

                    &:not(:first-child) {
                      td.placeholder-answer {
                        font-weight: unset;
                        color: #666666;
                      }
                    }

                    &:nth-child(2n) {
                      background: #eeeeee;
                    }
                  `}
                  key={answerIndex}
                >
                  <th
                    className={css`
                      white-space: nowrap;
                    `}
                  >
                    {x.time === null && <>Saving....</>}
                    {x.time !== null && <>{x.time.toDate().toLocaleString()}</>}
                  </th>
                  {Array.from({ length: numberOfQuestions }, (unused, i) => (
                    <td
                      className={cx(
                        "answer",
                        (x.answers[i] === null ||
                          answerIndex === previousAnswers.length - 1 ||
                          x.answers[i] === previousAnswers[answerIndex + 1].answers[i]) &&
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
      <p className="alert alert-warning">
        NB: only the answers submitted <strong>from this browser</strong> are shown here.{" "}
        <i>The official submission is the most recent one, even if submitted from a different browser.</i>
      </p>
    </>
  );
}
