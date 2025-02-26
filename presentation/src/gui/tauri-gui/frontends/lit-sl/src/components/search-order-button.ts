import { html, css, LitElement } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';

import sharedStyles from '../styles/shared-styles.js';

import { Order, SearchOrder } from '../types.js';


@customElement('search-order-button')
export class SearchOrderButton extends LitElement {
  static styles = [
    sharedStyles,
    css `
      :host {
        display: block;
        border: 1px solid black;
        padding: 0.2rem;
        font-size: 1.1em;

      }

      :host(.over) {
          border: 5px dotted #666;
      }
      .disabled {
          opacity: 0.5;
          &:before {
              display: inline-block;
              font-size: 1.1em;
              width: 1.5em;
              content: "x";
          }
      }
      .state_asc {
          /* border: 1px solid red; */

          &:before {
              display: inline-block;
              font-size: 1.1em;
              width: 1.5em;
              content: "⇣";
          }
      }

      .state_desc {
          /* border: 1px solid green; */
          &:before {
              display: inline-block;
              font-size: 1.1em;
              width: 1.5em;
              content: "⇡";
          }
      }

      .dragging {
          opacity: 0.4;
      }

    `
  ];

  @query("button")
  theButton!: HTMLButtonElement;

  @state()
  state: number = 1;

  @property()
  label = "";

  @property()
  value = "";



  connectedCallback(): void {
    super.connectedCallback();


    this.addEventListener("dragstart", this.dragStart);
    this.addEventListener("dragend", this.dragEnd);
    this.addEventListener("dragover", this.dragOver);
    this.addEventListener("dragenter", this.dragEnter);
    this.addEventListener("dragleave", this.dragLeave);
    this.addEventListener("drop", this.onDrop);
  }

  getOrder(): SearchOrder {
    return { title: this.label, value: this.value, order: this.state };
  }
  // getValue(){
  //   return this.stateValues[this.state];
  // }
  onClick() {
    this.state = (this.state + 4) % 3;
    this.dispatchEvent(new Event("search-value-updated", { bubbles: true, composed: true }));
    // console.log(this.state);
    // console.log(this.stateValues[this.state]);
  }

  dragStart(ev: DragEvent) {
    this.theButton.classList.add("dragging");

    ev.dataTransfer!.dropEffect = 'move';
    ev.dataTransfer!.setData('text/plain', this.id);
  }
  dragEnd() {
    this.theButton.classList.remove("dragging");
  }
  dragOver(ev:Event) {
    ev.preventDefault();
    return false;
  }
  dragLeave() {
    this.classList.remove("over");
  }
  dragEnter() {
    this.classList.add("over");
  }

  onDrop(ev:DragEvent) {
    ev.stopPropagation();
    this.classList.remove("over");
    let dragData = ev.dataTransfer!.getData('text/plain');

    if( dragData !== this.id) {
      console.log("do reorder");
      this.dispatchEvent(new CustomEvent("swap-search-order", { bubbles: true, composed: true, detail: { draggedId: dragData, targetId: this.id } }));
    }

    return false;

  }


  render() {
    let className = "";
    switch (this.state) {
      case Order.NONE:
        className = "disabled";
        break;
      case Order.ASC:
        className = "state_asc";
        break;
      case Order.DESC:
        className = "state_desc";
        break;

    }
    return html`
      <button class=${className} @click=${this.onClick}>${this.label}-${this.state}</button>
    `;
  }
}
