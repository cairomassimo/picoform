import { LanguageProvider } from "./intl";
import { Main } from "./main";

export function App() {
  return (
    <LanguageProvider>
      <Main />
    </LanguageProvider>
  );
}
