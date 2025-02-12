import { css } from 'lit';

export default css`
    * {
        box-sizing: border-box;
    }
    #layout-container {
      display: grid;
      position: relative;
      border: 2px dotted black;
      padding: 1em;

      justify-content: stretch;
      grid-template-columns: min-content auto;
      grid-template-rows: min-content 1fr auto;
      grid-template-areas:
        "aside header"
        "aside main"
        "aside footer";

      width: 100%;
      height: 100%;
      grid-gap: 0.25em;
      box-sizing: border-box;

      & > * {
        border: 1px solid black;
      }
    }

    header {
      grid-area: header;
      resize: vertical;
      overflow: scroll;
      height: 5em;
      width: 100%;
      max-height: 15em;
      min-height: 1em;
    }
    aside {
      grid-area: aside;
      overflow: scroll;
      resize: horizontal;
      height: 100%;
      width: 12em;
      max-width: 25em;
      min-width: 2em;
      text-wrap: nowrap;
    }

    main {
      grid-area: main;
      height: 100%;
      width: 100%;
      overflow-y: scroll;
    }

    footer {
      grid-area: footer;
    }

    .content-wrapper {
      display: block;

      padding: 0.5em;
      height: 100%;
    }
    .aside-wrapper {
      overflow: scroll;
      resize: horizontal;
      height: 100%;
      width: 5em;
      max-width: 25em;
      min-width: 1em;
      text-wrap-mode: nowrap;
    }
`;
