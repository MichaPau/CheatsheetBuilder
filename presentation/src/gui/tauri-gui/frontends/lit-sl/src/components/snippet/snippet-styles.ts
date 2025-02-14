import { css } from 'lit';

export default css`
:host {
  flex: 1 1 100%;
  display: block;
  width: 100%;
  --padding: var(--spacing-large);

}

.card {
    display: flex;
    flex-direction: column;
    background-color: var(--panel-background-color);
    box-shadow: var(--shadow-small);
    border: var(--border-style) var(--border-width) var(--border-color);
    border-radius: var(--border-radius-medium);
}
.card > * {
    padding: var(--spacing-medium);
}
#header {
    border-bottom: solid var(--border-width) var(--border-color);
}
.snippet-item {

  width: 100%;
  --padding: var(--spacing-small);
}
#editor-component {
  min-height: var(-snippet-body-min-height);
}
.snippet-title-label {
    display: block;
    box-sizing: border-box;
    line-height: 1.5em;
    width: 100%;
    /* border-radius: var(--sl-border-radius-medium); */

    &:read-only {
        border: none;
    }
  }
  .footer {
      display: flex;
      flex-direction: column;
      gap: var(--sl-spacing-2x-small);
      border: 1px solid black;
  }

  details > summary {
      list-style-type: none;
  }

  details > summary::-webkit-details-marker {
      display: none;
  }
  .tag-search-input {
      flex: 1 1 50%;
  }
  #tag-search-result {

      display: flex;
      gap: var(--spacing-small);

      &.option {
          appearance: none;
          background-color: transparent;
          border: 0;
          padding:10px;
          margin:-5px -20px -5px -5px;
      }
  }
  .test {
      display: inline-block;
  }
`;
