import { FormattedMessage } from "react-intl";
import { Announcement } from "./announcement";
import { AnnouncementCard } from "./announcement-card";

export function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) return null;

  return (
    <div className="mb-5">
      <h2>
        <FormattedMessage defaultMessage="Announcements" id="announcements" />
      </h2>
      {announcements.map((announcement, index) => (
        <AnnouncementCard announcement={announcement} key={index} />
      ))}
    </div>
  );
}
