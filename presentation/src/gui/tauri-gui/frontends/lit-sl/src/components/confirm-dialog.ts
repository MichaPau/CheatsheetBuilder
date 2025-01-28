import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import sharedStyles from '../styles/shared-styles.js';


@customElement('confirm-dialog')
export class ConfirmDialog extends LitElement {
  static styles = [
    sharedStyles,
    css `
      :host {
        display: block;
      }

      dialog {
        background-color: var(--panel-background-color);
        box-shadow: var(--shadow-small);
        border: solid var(--border-width) var(--border-color);
        border-radius: var(--border-radius-medium);
      }
    `
  ];

  @property()
  message: String = "no message";

  async confirm(): Promise<boolean> {
    await this.updateComplete;
    const ok_button = this.shadowRoot?.querySelector("#ok_button");
    const cancel_button = this.shadowRoot?.querySelector("#cancel_button");

    const dlg: HTMLDialogElement = this.shadowRoot?.querySelector("#dialog-container")!;
    dlg.showModal();

    return new Promise((resolve, _reject) => {
      ok_button?.addEventListener("click", () => {
        resolve(true);
        this.remove();
      });

      cancel_button?.addEventListener("click", () => {
        resolve(false);
        this.remove();
      });


    });
  }
  connectedCallback(): void {
    super.connectedCallback();
  }
  render() {
    return html`
        <dialog id="dialog-container">
          <p>${this.message}</p>
            <button id="ok_button">Ok</button>
            <button id="cancel_button">Cancel</button>
        </dialog>
    `;
  }
}
