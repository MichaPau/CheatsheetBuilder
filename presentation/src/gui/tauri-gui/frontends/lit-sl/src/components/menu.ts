import { html, css, LitElement, PropertyValues } from "lit";
import { customElement, state, query } from "lit/decorators.js";


import { Tag } from "../types";
import sharedStyles from "../styles/shared-styles";

enum MenuAction {
  ADD = "add",
  RENAME = "rename",
  DELETE = "delete",
}
@customElement("custom-menu")
export class CustomMenu extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        border: 1px solid black;
        background-color: var(--panel-background-color);
        padding: 0.5em;
        z-index: 999;
        position: fixed;
        width: 300px;
        /* max-width: 200px; */
      }
      h3 {
        margin: 0;
        padding: 0;
        margin-bottom: 0.25em;
        border-bottom: 1px solid var(--border-color);
      }
      .menu-item:hover {
        background-color: grey;
      }
      .disabled {
          pointer-events: none;
          color: gray;
      }
    `,
  ];

  @state()
  item!: Tag;

  @state()
  action_state: MenuAction | undefined;

  @state()
  isRoot = false;

  @query("input")
  input_elem?: HTMLInputElement;

  constructor() {
    super();
    this.addEventListener("mouseleave", (_ev: Event) => {
      console.log("mouseleave");
      this.remove();
    });
    this.addEventListener("blur", (_ev: Event) => {
      console.log("blur");
      //this.remove();
    });

    this.addEventListener("keydown", this.handleKeyDown);
    this.addEventListener("click", (ev: Event) => {
      // console.log("click on summary");
      // ev.preventDefault();
    });
    this.tabIndex = 0;

    // window.addEventListener("keydown", this.escape_remove);
  }

  connectedCallback(): void {
    super.connectedCallback();
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  handleKeyDown(ev: KeyboardEvent) {
    console.log("keydown:", ev.key);
    if (ev.key === "Escape") {
      this.remove();
    }
  }

  inputKeyDown(ev: KeyboardEvent) {
    ev.stopPropagation();
    if (ev.key === "Escape") {
      this.action_state = undefined;
      this.focus();
    }

    if (ev.key === "Enter") {
      if (this.action_state === MenuAction.RENAME) {
        const new_title = this.input_elem?.value;
        if ( new_title !== this.item.title) {
          console.log("Update title to: ", new_title);
          this.dispatchEvent(new CustomEvent('update_category_title', { bubbles: true, composed: true, detail: { tag_id: this.item.id, new_title: new_title } }));
          this.remove();
        }
      } else if (this.action_state === MenuAction.ADD) {
        const title = this.input_elem?.value;
        if (title !== "") {
          console.log("Add new to: ", this.input_elem?.value);
          this.dispatchEvent(new CustomEvent('add_category', { bubbles: true, composed: true, detail: { parent_id: this.item.id, title: title } }));
          this.remove();
        }
      }
    }
  }

  protected updated(_changedProperties: PropertyValues): void {
    if (_changedProperties.has("action_state") && this.input_elem) {
      this.input_elem.focus();
    }
  }
  protected firstUpdated(_changedProperties: PropertyValues): void {
    const items = this.shadowRoot?.querySelectorAll(".menu-item")!;

    for (const item of items) {
      item.addEventListener("click", (ev: Event) => {
        //ev.stopImmediatePropagation();
        //ev.preventDefault();
        const action = (item as HTMLElement).dataset.action;
        switch (action) {
          case MenuAction.ADD:
            this.action_state = action;
            break;
          case MenuAction.RENAME:
            this.action_state = action;
            break;
          case MenuAction.DELETE:
            this.dispatchEvent(new CustomEvent('delete_category', { bubbles: true, composed: true, detail: { tag_id: this.item.id, title: this.item.title} }))
            break;
        }
        // this.dispatchEvent(
        //   new CustomEvent("menu-action", {
        //     bubbles: true,
        //     composed: true,
        //     detail: { action },
        //   }),
        // );
        //this.remove();
      });
    }
    this.focus();
  }
  render() {

    return html`
      <h3>${this.item.id}: ${this.item.title}</h3>
      <div tabindex="0" class="menu-item ${this.action_state !== MenuAction.ADD && this.action_state ? 'disabled': ''}" data-action=${MenuAction.ADD}>
        Add new
      </div>
      ${this.action_state == MenuAction.ADD
        ? html`<div>
            New: <input type="text" @keydown=${this.inputKeyDown}/>
          </div>`
        : ``}
      <div tabindex="0" class="menu-item ${this.isRoot ||(this.action_state !== MenuAction.RENAME && this.action_state) ? 'disabled' : ''}" data-action=${MenuAction.RENAME}>
        Rename
      </div>
      ${this.action_state == MenuAction.RENAME
        ? html`<div>
            <input
              type="text"
              value=${this.item.title}
              @keydown=${this.inputKeyDown}
            />
          </div>`
        : ``}
      <div tabindex="0" class="menu-item ${this.isRoot || (this.action_state !== MenuAction.DELETE && this.action_state) ? 'disabled' : ''}" data-action=${MenuAction.DELETE}>
        Delete
      </div>
    `;
  }
}
