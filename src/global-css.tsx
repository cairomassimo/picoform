import { injectGlobal } from "@emotion/css";

injectGlobal`
  html {
    overflow-y: scroll;
  }

  * {
    min-width: auto;
    min-height: auto;
  }
`;
