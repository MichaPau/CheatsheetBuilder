import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import sharedStyles from '../styles/shared-styles.js';

import './test-lit-comp.js';
import './test-vanilla-comp.js';

@customElement('test-wrapper')
export class TestWrapper extends LitElement {


  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("test-event", this.test_event);
  }

  test_event = async (ev: Event) => {


    console.log("TestWrapper::test_event");


    console.log("srcElement:", ev.srcElement);
    console.log("target:", ev.target);
    console.log("path[0]", ev.composedPath());


    console.log("srcElement:", ev.srcElement);
    console.log("target:", ev.target);
    console.log("path[0]", ev.composedPath());
  }
  render() {
    return html`
        <test-lit></test-lit>
        <test-vanilla-comp></test-vanilla-comp>
    `;
  }
}
