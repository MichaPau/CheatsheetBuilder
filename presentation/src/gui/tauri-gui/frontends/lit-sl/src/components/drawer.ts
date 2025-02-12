import { html, css, LitElement, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import sharedStyles from '../styles/shared-styles.js';

@customElement('drawer-comp')
export class drawer extends LitElement {
  static styles = [
    sharedStyles,
    css `
      :host {
        display: inline-block;
      }

      button {
          display: flex;
          align-items : center;
          padding: 0.25rem;
          border: 2px solid black;
          border-radius: 50%;
          img {
           width: 3rem;
           height: 3rem;

          }
      }
      [popover]:popover-open {
        min-width: 325px;
        min-height: 200px;
        top: unset;
        right: 0;
        left: 0;
        position: fixed;
        bottom: 15px;
        transform: translateY(0);
        opacity: 1;


      }

      [popover] {
          min-width: 325px;
          min-height: 200px;
          top: unset;
          right: 0;
          left: 0;
          position: fixed;
          bottom: 15px;
          transform: translateY(100%);
          opacity: 0;
          transition:
            all .5s;
      }
      ::backdrop {
          backdrop-filter: blur(3px);
      }
      @starting-style {
          [popover]:popover-open {
              min-width: 325px;
              min-height: 200px;
              top: unset;
              right: 0;
              left: 0;
              position: fixed;
              bottom: 15px;
              transform: translateY(100%);
              opacity: 0;

          }
      }
    `
  ];

  @state()
  state_var = false;

  connectedCallback(): void {
    super.connectedCallback();

  }
  protected firstUpdated(_changedProperties: PropertyValues): void {
    const popover = this.shadowRoot?.getElementById("thepopover")!;
    popover.showPopover();
  }
  render() {
    return html`
        <button popovertarget="thepopover" aria-label="Add new"><img  src="/src/assets/icons/plus.svg"></button>
        <div id="thepopover" popover>
            <slot></slot>
        </div>
    `;
  }
}
