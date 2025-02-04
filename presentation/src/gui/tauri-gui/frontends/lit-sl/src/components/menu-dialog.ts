import { html, css, LitElement, PropertyValues } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';

import sharedStyles from '../styles/shared-styles.js';

@customElement('menu-dialog')
export class MenuDialog extends LitElement {
  static styles = [
    css`
      :host {
        width: 300px;
      }
      h3 {
        margin: 0;
        padding: 0;
        margin-bottom: var(--spacing-small);
        border-bottom: 1px solid var(--border-color);
      }
      .menu-item:hover {
        background-color: grey;
      }
      .disabled {
          pointer-events: none;
          color: gray;
      }
    `,
  ];

  @state()
  state_var = false;

  remove_me() {
    this.remove();
  }

  @query("#dialog")
  dialog?: HTMLDialogElement;

  connectedCallback(): void {
    super.connectedCallback();

  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    console.log(this.dialog);
    this.dialog?.showModal();
  }
  render() {
    return html`
        <dialog id="dialog">
            <h3>Dial example</h3>
            <input type="text"/>
            <button @click=${(_ev: Event) => this.remove_me()}>Close</button>
        </dialog>
    `;
  }
}
