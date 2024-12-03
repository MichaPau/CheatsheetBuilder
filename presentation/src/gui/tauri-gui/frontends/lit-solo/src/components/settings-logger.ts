import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {consume, ContextConsumer} from '@lit/context';

import { appContext, AppSettings } from '../utils/app-context.js';

import mainStyles from '../styles/mainStyle.js';

@customElement('settings-logger')
export class SettingsLogger extends LitElement {
  static styles = [
    mainStyles,
    css `
      :host {
        display: block;
      }
      .logger-container {
          display: flex;
          flex-direction: columns;
      }
      .id-container {
          display: flex;
      }
    `
  ];

  @consume({ context: appContext, subscribe: true })
  @state()
  appSettings!: AppSettings;

  connectedCallback(): void {
    super.connectedCallback();
  }
  render() {
      return html`
        <div class="logger-container">
            <div class="id-container">
                Open categories ids:
                ${this.appSettings.open_categories.map((id) =>
                    html`<div>id: ${ id }</div>`
                )}
            </div>
            <div>
                Selected categories ids:
                ${this.appSettings.selected_categories.map((id) =>
                    html`<div>id: ${ id }</div>`
                )}
            </div>
        </div>
    `;
  }
}
