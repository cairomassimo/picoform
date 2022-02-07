import { ReactNode, useEffect, useState } from "react";
import { defineMessage, IntlProvider, MessageDescriptor, useIntl } from "react-intl";
import { Form } from "react-bootstrap";

import en from "./intl/en.json";
import it from "./intl/it.json";

const messages = { en, it };
type SupportedLanguage = keyof typeof messages;

const supportedLanguages = Object.keys(messages) as Array<SupportedLanguage>;
const supportedLanguageSet = new Set<string>(supportedLanguages);

const defaultLanguage: SupportedLanguage = "en";

const languageNames: Record<SupportedLanguage, MessageDescriptor> = {
  en: defineMessage({ defaultMessage: `English`, id: `language-en` }),
  it: defineMessage({ defaultMessage: `Italiano (Italian)`, id: `language-it` }),
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const browserLanguage = useBrowserLanguage();
  const [overrideLanguage, setOverrideLanguage] = useState<SupportedLanguage | null>(null);
  const currentLanguage = overrideLanguage ?? browserLanguage;

  return (
    <IntlProvider
      defaultLocale={defaultLanguage}
      locale={currentLanguage}
      messages={messages[currentLanguage]}
      defaultRichTextElements={{
        strong: (content) => <strong>{content}</strong>,
        emph: (content) => <i>{content}</i>,
      }}
    >
      <LanguageSelector onChange={setOverrideLanguage} browserLanguage={browserLanguage} />
      {children}
    </IntlProvider>
  );
}

function LanguageSelector({
  onChange,
  browserLanguage,
}: {
  onChange: (language: SupportedLanguage | null) => void;
  browserLanguage: SupportedLanguage;
}) {
  const intl = useIntl();

  return (
    <Form.Select
      onChange={(event) => {
        onChange((event.currentTarget.value || null) as SupportedLanguage | null);
      }}
    >
      <option
        value=""
        label={intl.formatMessage(defineMessage({ defaultMessage: `Auto - {language}`, id: "language-auto" }), {
          language: intl.formatMessage(languageNames[browserLanguage]),
        })}
      />
      {supportedLanguages.map((language) => (
        <option key={language} value={language} label={intl.formatMessage(languageNames[language])} />
      ))}
    </Form.Select>
  );
}

function useBrowserLanguage() {
  const [language, setLanguage] = useState(getBrowserLanguage());

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    function handler() {
      setLanguage(getBrowserLanguage());
    }

    window.addEventListener("languagechange", handler);

    return () => {
      window.removeEventListener("languagechange", handler);
    };
  }, []);

  return language;
}

function getBrowserLanguage() {
  const languages = navigator.languages ?? [];
  return (languages.find((language) => supportedLanguageSet.has(language)) ?? defaultLanguage) as SupportedLanguage;
}
