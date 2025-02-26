import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import sharedStyles from '../styles/shared-styles.js';

@customElement('test-lit')
export class TestLit extends LitElement {

  static styles = [
    sharedStyles,
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
    this.addEventListener("test-event", this.test_event);
  }

  timeout(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }
  test_event = async (ev: Event) => {

    // ev.stopPropagation();
    // ev.stopImmediatePropagation();
    // ev.preventDefault();
    console.log("TestLit::test_event");


    console.log("srcElement:", ev.srcElement);
    console.log("target:", ev.target);
    console.log("path[0]", ev.composedPath());

    await this.timeout(500);

    console.log("srcElement:", ev.srcElement);
    console.log("target:", ev.target);
    console.log("path[0]", ev.composedPath());
  }
  render() {
    return html`
      <button @click=${() => this.dispatchEvent(new CustomEvent('test-event', {bubbles: true, composed: true}))}>Test Event</button>
    `;
  }
}
