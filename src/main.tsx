import { FormattedMessage } from "react-intl";
import { useAnonymousUser } from "./auth";
import { useAppConfig } from "./config";
import { SubmissionPanel } from "./submission-panel";
import { TokenForm, useTokenState } from "./token-form";
import { Helmet } from "react-helmet";
import { AnnouncementList } from "./announcement-list";

import { Container, Navbar } from "react-bootstrap";
import { LanguageSelector } from './intl';

export const previousAnswersLimit = 10;

export function Main() {
  const config = useAppConfig();
  const user = useAnonymousUser();

  const tokenState = useTokenState();

  const numberOfQuestions = 20 // config?.numberOfQuestions;
  const canAnswer = true; // config.canAnswer ?? false;
  const title = config?.title ?? `OII - Fase scolastica`;
  const announcements = config?.announcements ?? [/*{
    title: "Danger",
    content: "fai schifo",
    severity: "danger",
  }, {
    title: "Info",
    content: "glhf",
    severity: "info",
  }*/];

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      <Navbar bg="light">
        <Container>
          <Navbar.Brand>
            <img src="/logo.png" alt="" width="32" height="32" className="d-inline-block me-3" />
            <span> {title} </span>
          </Navbar.Brand>
          <LanguageSelector />
        </Container>
      </Navbar>

      <Container>
        {(!user || !config) && <FormattedMessage defaultMessage="Loading..." id="loading" />}
        {user && config && (
          <>
            <AnnouncementList announcements={announcements} />
            {numberOfQuestions === undefined && <FormattedMessage defaultMessage="Not configured." id="not-configured" />}
            {numberOfQuestions !== undefined && (
              <>
                <TokenForm tokenState={tokenState} />
                {tokenState.token !== null && (
                  <SubmissionPanel
                    canAnswer={canAnswer}
                    numberOfQuestions={numberOfQuestions}
                    user={user}
                    token={tokenState.token}
                  />
                )}
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
}
