import { injectGlobal } from "@emotion/css";

injectGlobal`
  html {
    overflow-y: scroll;
  }

  body {
    margin: 1rem;
  }

  * {
    min-width: auto;
    min-height: auto;
  }
`;
