import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {consume, ContextConsumer} from '@lit/context';

import { appSettingContext, AppSettings } from '../utils/app-context.js';

import sharedStyles from '../styles/shared-styles.js';

@customElement('settings-logger')
export class SettingsLogger extends LitElement {
  static styles = [
    sharedStyles,
    css `
      :host {
        display: block;
      }
      .logger-container {
          display: flex;
          flex-direction: columns;
          gap: 0.5em;

      }
      .id-container {
          display: flex;
          gap: 0.25em;
      }
      .id-container > div:not(:last-child) {
          border-right: solid black 1px;
          padding-right: 0.25em;
      }
    `
  ];

  @consume({ context: appSettingContext, subscribe: true })
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
                    html`<div>${id}</div>`
                )}
            </div>
            <div> || </div>
            <div class="id-container">
                Selected categories ids:
                ${this.appSettings.selected_categories.map((id) =>
                    html`<div>${id}</div>`
                )}
            </div>
            <div> || </div>
            <div class="id-container">
                Search order:
                ${this.appSettings.search_order.map((order) =>
                    html`<div>${order.value} ${order.order}</div>`
                )}
            </div>
        </div>
    `;
  }
}
