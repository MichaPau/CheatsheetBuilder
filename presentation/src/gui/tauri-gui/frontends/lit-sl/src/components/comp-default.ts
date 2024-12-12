import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import mainStyles from '../styles/mainStyle.js';

@customElement('comp-item')
export class Comp extends LitElement {
  static styles = [
    mainStyles,
    css `
      :host {
        display: block;
      }
    `
  ];

  @state()
  state_var = false;

  connectedCallback(): void {
    super.connectedCallback();
  }
  render() {
    return html``;
  }
}
