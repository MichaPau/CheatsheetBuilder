import { html, css, LitElement, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { consume } from '@lit/context';

import sharedStyles from '../styles/shared-styles.js';

import './snippet/snippet.js';
import { AppDataSnippets, appDataSnippetsContext } from '../utils/app-context.js';

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
  @consume({ context: appDataSnippetsContext, subscribe: true })
  @state()
  appDataSnippets!: AppDataSnippets;

  protected shouldUpdate(_changedProperties: PropertyValues): boolean {
    //console.log("SnippetList::shouldUpdate", _changedProperties);
    return super.shouldUpdate(_changedProperties);
  }
  connectedCallback(): void {
    super.connectedCallback();
  }
  protected firstUpdated(_changedProperties: PropertyValues): void {
    //this.dispatchEvent(new Event('get_data', { bubbles: true, composed: true }));
  }
  render() {
    return html`
        <div class="snippet-container">
            ${this.appDataSnippets.snippets.map((snippet) => {
                return html`
                    <snippet-item .snippet=${snippet}></snippet-item>
                `
                }
            )}
        </div>
    `;
  }
}
