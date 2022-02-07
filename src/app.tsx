import { LanguageProvider } from "./intl";
import { Main } from "./main";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

export function App() {
  return (
    <LanguageProvider>
      <Main />
    </LanguageProvider>
  );
}
