import { FormattedTime } from "react-intl";
import { Announcement } from "./announcement";
import { Alert } from "react-bootstrap";

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const content = (announcement.content ?? "").split("\\n");
  return (
    <Alert variant={announcement.severity || "info"}>
      {announcement.time && (
        <div>
          <FormattedTime value={announcement.time.toDate()} timeStyle="short" fractionalSecondDigits={3} />
        </div>
      )}
      {announcement.title && (
        <h3>
          {announcement.title}
        </h3>
      )}
      {content.map((line, lineNumber) => (
        <p className="mb-0" key={lineNumber} >
          {line}
        </p>
      ))}
    </Alert>
  );
}
