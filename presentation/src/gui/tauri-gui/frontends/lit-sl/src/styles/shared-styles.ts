import { css } from 'lit';

export default css`

    :host {
        font-family: var(--default-font-family);


    }

    sl-tree-item::part(label) {
        font-family: var(--default-font-family);
    }
    textarea, input {
        border-radius: var(--border-radius-medium);
        font-family: var(--default-font-family);

        &:focus {
            outline: none;
            border: var(--focus-ring-style) var(--focus-ring-width) var(--focus-ring-color);
        }
    }

    .tag {
        display: flex;
        justify-content: center;
        height: 1.2em;
        align-items: center;

        padding: var(--spacing-small);
        gap: var(--spacing-small);
        border-radius: var(--border-radius-medium);
        font-size: var(--font-size-small);

        cursor: pointer;
        &.disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

      &.category {
          background-color: lch(var(--l-80) var(--tag-color-category));
          border: 1px solid lch(var(--l-40) var(--tag-color-category));

        &:hover {
            background-color: lch(var(--l-60) var(--tag-color-category));
        }
      }
      &.normal {
          background-color: lch(var(--l-80) var(--tag-color-normal));
          border: 1px solid lch(var(--l-40) var(--tag-color-normal));

          &:hover {
              background-color: lch(var(--l-60) var(--tag-color-normal));
          }
      }

    }
`;
