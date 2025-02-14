import { html, css, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { consume, ContextConsumer } from '@lit/context';

import sharedStyles from '../styles/shared-styles.js';

import './snippet/snippet.js';
import { AppData, appDataContext } from '../utils/app-context.js';

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
  // private _myData = new ContextConsumer(this, {
  //     context: appDataContext,
  //   callback: (value: AppData) => {
  //     console.log("callback from snippet-list");
  //     console.log(JSON.stringify(value.snippets));
  //     this.snippets = value.snippets;
  //   },
  //     subscribe: true,
  //   }
  // );
  @consume({ context: appDataContext, subscribe: true })
  @state()
  appData!: AppData;
  // @state()
  // snippets: Array<Snippet> = [];

  // @property({attribute: false})
  // snippets: Array<Snippet> = [];

  protected shouldUpdate(_changedProperties: PropertyValues): boolean {
    //console.log("SnippetList::shouldUpdate", _changedProperties);
    return super.shouldUpdate(_changedProperties);
  }
  connectedCallback(): void {
    super.connectedCallback();
    console.log("connectedCallback");
  }
  protected firstUpdated(_changedProperties: PropertyValues): void {
    //this.dispatchEvent(new Event('get_data', { bubbles: true, composed: true }));
  }
  render() {
    return html`
        <div class="snippet-container">
            ${this.appData.snippets.map((snippet) =>
                html`
                    <snippet-item .snippet=${snippet}></snippet-item>
                `
            )}
        </div>
    `;
  }
}
