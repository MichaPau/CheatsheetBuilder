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
        border: 1px solid red;
        width: 100%;
        height: 100vh;
      }
    `
  ];

  @state()
  state_var = false;

  connectedCallback(): void {
    super.connectedCallback();
    console.log("connectedCallback");
  }
  render() {
    return html``;
  }
}