import { css } from "@emotion/css";
import { FormattedTime } from "react-intl";
import { Announcement } from "./announcement";

function backgroundColor(severity: Announcement["severity"]) {
  switch (severity) {
    case "danger":
      return "#ff9999";
    case "warning":
      return "#ffff99";
    case "info":
      return "#e6e6e6";
    default:
      return "white";
  }
}

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const content = (announcement.content ?? "").split("\\n");
  return (
    <div
      className={css`
        border: 1px solid;
        border-radius: 0.25rem;
        padding: 1rem;
        margin-bottom: 1rem;
        background-color: ${backgroundColor(announcement.severity)};
      `}
    >
      {announcement.time && (
        <div
          className={css`
            float: right;
          `}
        >
          <FormattedTime value={announcement.time.toDate()} timeStyle="short" fractionalSecondDigits={3} />
        </div>
      )}
      {announcement.title && (
        <h3
          className={css`
            margin: 0 0 0.375rem 0;
          `}
        >
          {announcement.title}
        </h3>
      )}
      {content.map((line, lineNumber) => (
        <p
          key={lineNumber}
          className={css`
            margin: 0;
          `}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
