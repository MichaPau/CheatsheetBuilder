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
          all: unset;
          cursor: pointer;
          /* margin-left: var(--spacer-small); */
          /* border: 1px solid black; */

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
          display: inline-flex;
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
              /* width: 300px;
              height: 300px; */
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
    //console.log("TagItem::shouldUpdate", _changedProperties);
    return super.shouldUpdate(_changedProperties);
  }
  showParents(tag_list: Array<Tag>) {
    console.log("show parents");
    this.parent_tags = tag_list;
    const dropdown = this.shadowRoot?.querySelector(".menu-container");
    if (dropdown) {
      dropdown.classList.add("show");
    }
  }
  onTriggerParents = (_ev:Event) => {
    console.log("Tag::onTriggerParents:", this);

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
            <div class="tag-container" @mouseover=${this.onTriggerParents} @mouseleave=${this.removeParents}>
                <div class="tag category">
                    ${this.tag.title}
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
                    ${this.tag.title}
                    <button class="icon-button" @click=${this.removeTag}>
                        <img src="./src/assets/icons/x-circle.svg"/>
                    </button>
                </div>
            </div>
        `;
    }

  }
}

//<div class="tag-text">${this.tag.title}</div>
// <sl-button
//     @mouseover=${this.onTriggerParents}
//     @mouseleave=${this.removeParents}
//     variant="warning" slot="trigger" size="small" caret>${this.tag.title}
// </sl-button>
