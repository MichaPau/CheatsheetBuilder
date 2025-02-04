import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import sharedStyles from '../styles/shared-styles.js';

import { Snippet } from '../types.js';

import './snippet.js';

@customElement('snippet-list')
export class SnippetList extends LitElement {
  static styles = [
    sharedStyles,
    css `
      :host {
        display: block;
      }
      .snippet-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 1em;
        width: 100%;
        height: 100%;

      }
    `
  ];

  @property({attribute: false})
  snippets: Array<Snippet> = [];

  connectedCallback(): void {
    super.connectedCallback();
    console.log("connectedCallback");
  }
  render() {
    return html`
        <div class="snippet-container">
            ${this.snippets.map((snippet) =>
                html`
                    <snippet-item .snippet=${snippet}></snippet-item>
                `
            )}
        </div>
    `;
  }
}
