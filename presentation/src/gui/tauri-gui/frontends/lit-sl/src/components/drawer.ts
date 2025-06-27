import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import sharedStyles from '../styles/shared-styles.js';

@customElement('drawer-comp')
export class Drawer extends LitElement {
  static styles = [
    sharedStyles,
    css `
      :host {
        display: inline-block;
        background-color: rgba(0, 0, 0, 0);
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
          transition: all .2s;
          box-shadow: var(--shadow-medium);
          border: var(--border-style) var(--border-width) var(--border-color);
          border-radius: var(--border-radius-medium);
      }
      ::backdrop {
          backdrop-filter: blur(2px);
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

  manualOpen(_ev: Event) {
    console.log("open manual");
    const popover = this.shadowRoot?.getElementById("thepopover")!;
    popover.showPopover();
    const the_slot = this.shadowRoot?.querySelector('slot')!;
    const item = the_slot.assignedElements({flatten: true})[0] as HTMLElement;
    item.focus();
    
  }
  close() {
    const popover = this.shadowRoot?.getElementById("thepopover")!;
    popover.hidePopover();
  }
  render() {
    return html`
        <button popovertarget_temp="thepopover" @click=${this.manualOpen} aria-label="Add new"><img  src="/src/assets/icons/plus.svg"></button>
        <div part="popover" id="thepopover" popover>
            <slot></slot>
        </div>
    `;
  }
}
