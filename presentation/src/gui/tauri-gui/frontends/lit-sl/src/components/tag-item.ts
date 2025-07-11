import { html, css, LitElement, PropertyValues } from 'lit';
import { customElement, property, state} from 'lit/decorators.js';

import sharedStyles from '../styles/shared-styles.js';
import { Tag } from '../types.js';

@customElement('tag-item')
export class TagItem extends LitElement {
  static styles = [
    sharedStyles,
    css `
      :host {
        display: block;

      }
      .icon-button {
          /* all: unset; */
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          background: none;
          padding: 0;
          cursor: pointer;

          img {
              vertical-align: middle;
                display: inline-block;
          }

          &:hover {
              scale: 1.2;
          }
      }

      .tag-text {
          border: var(--border-width) var(--border-style) var(--border-color);
      }
      .tag-container {
          display: flex;
          position: relative;
      }
      .menu-container {
          display: none;
          box-sizing: border-box;
          border: var(--border-width) var(--border-style) var(--border-color);
          min-width: 200px;
          background-color: var(--panel-background-color);

          &.show {
              display: block;
              position: absolute;
              z-index: var(--z-index-menu);
              bottom: 100%;
              left: 0;
          }
      }

      .parent-item:not(:last-child){
          border-bottom: 1px solid black;
      }
    `
  ];

  @property({type: Object})
  tag!:Tag;

  @state()
  parent_tags:Array<Tag> = [];


  connectedCallback(): void {
    super.connectedCallback();
  }

  protected shouldUpdate(_changedProperties: PropertyValues): boolean {
    return super.shouldUpdate(_changedProperties);
  }
  showParents(tag_list: Array<Tag>) {
    this.parent_tags = tag_list;
    const dropdown = this.shadowRoot?.querySelector(".menu-container");
    if (dropdown) {
      dropdown.classList.add("show");
    }
  }
  onTriggerParents = (_ev:Event) => {
    // console.log("onTriggeraParents: ", _ev.target, _ev.currentTarget);
    this.dispatchEvent(new CustomEvent("get-parent-tags", { bubbles: false, composed: false, detail: { id: this.tag.id } }));
  }

  async removeParents() {

    const dropdown = this.shadowRoot?.querySelector(".menu-container");
    if (dropdown) {
      dropdown.classList.remove("show");
    }
    this.parent_tags = [];
  }

  removeTag = (_ev: Event) => {
    this.dispatchEvent(new CustomEvent("remove-tag-from-snippet", { bubbles: true, composed: true, detail: { tag_id: this.tag.id } }));
  }
  render() {
    if (this.tag.tag_type === "Category") {
        return html`
            <div class="tag-container">
                <div class="tag category" @mouseenter=${this.onTriggerParents} @mouseleave=${this.removeParents}>
                    <div>${this.tag.title}</div>
                    <button class="icon-button" @click=${this.removeTag}>
                      <img src="./src/assets/icons/x-circle.svg"/>
                    </button>
                </div>
                <div class="menu-container">
                    ${this.parent_tags.map((tag: Tag) => {
                        return html`<div class="parent-tag">${tag.title}</div>`;
                    })}
                </div>

            </div>
        `;
    } else {
      return html`
            <div class="tag-container">
                <div class="tag normal">
                    <div>${this.tag.title}</div>
                    <button class="icon-button" @click=${this.removeTag}>
                        <img src="./src/assets/icons/x-circle.svg"/>
                    </button>
                </div>
            </div>
        `;
    }

  }
}

                      // @mouseover=${(ev: Event) => { ev.stopPropagation(); return false;}}
                      // @mouseleave=${(ev: Event) => { ev.stopPropagation(); return false;}}
