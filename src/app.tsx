import { LanguageProvider } from "./intl";
import { Main } from "./main";

import "bootstrap/dist/css/bootstrap.min.css";

export function App() {
  return (
    <LanguageProvider>
      <Main />
    </LanguageProvider>
  );
}
