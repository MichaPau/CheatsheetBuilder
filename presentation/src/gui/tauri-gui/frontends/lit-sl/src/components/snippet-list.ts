import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import mainStyles from '../styles/mainStyle.js';

import { Snippet } from '../types.js';

import './snippet.js';

@customElement('snippet-list')
export class Comp extends LitElement {
  static styles = [
    mainStyles,
    css `
      :host {
        display: block;
      }
    `
  ];

  @property({type: Array})
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
                    <!-- <sl-card class="snippet-item">
                        <div slot="header">
                            ${snippet.title}
                        </div>
                        <div slot="footer">
                            ${snippet.tags.map((tag) =>
                                html`<div>${tag.title}</div>`
                            )}
                        </div>
                        ${snippet.text}
                    </sl-card> -->
                `
            )}
        </div>
    `;
  }
}
