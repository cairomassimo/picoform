import { FormattedMessage } from "react-intl";
import { Announcement } from "./announcement";
import { AnnouncementCard } from "./announcement-card";

export function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) return null;

  return (
    <div>
      <h2>
        <FormattedMessage defaultMessage="Announcements" id="announcements" />
      </h2>
      {announcements.map((announcement) => (
        <AnnouncementCard announcement={announcement} key={announcement.time?.toString()} />
      ))}
    </div>
  );
}
