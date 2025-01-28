import { html, css, LitElement } from 'lit';
import { customElement, property} from 'lit/decorators.js';

import sharedStyles from '../styles/shared-styles.js';
import { Tag } from '../types.js';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.component.js';

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
          border: 1px solid black;
      }
      .tag-container {
          display: inline-flex;
          position: relative;
      }
      .menu-container {
          display: none;
          border: 1px solid black;

          &.show {
              display: block;
          }
      }

      .parent-item:not(:last-child){
          border-bottom: 1px solid black;
      }
    `


  ];

  @property({attribute: false})
  tag!:Tag;

  @property({attribute: false})
  parent_tags:Array<Tag> = [];


  connectedCallback(): void {
    super.connectedCallback();
  }


  showParents(tag_list: Array<Tag>) {
    this.parent_tags = tag_list;
    const dropdown = this.shadowRoot?.querySelector(".menu-container");
    if (dropdown) {
      dropdown.classList.add("show");
    }
  }
  onTriggerParents(_ev:Event) {
    console.log("Tag::onTriggerParents");
    this.dispatchEvent(new CustomEvent("get-parent-tags", { bubbles: false, composed: true, detail: { id: this.tag.id } }));
  }
  async removeParents() {

    const dropdown = this.shadowRoot?.querySelector(".menu-container");
    if (dropdown) {
      dropdown.classList.remove("show");
    }
    this.parent_tags = [];
  }

  removeTag = (_ev: Event) => {
    this.dispatchEvent(new CustomEvent("remove-tag-from-snippet", { bubbles: true, composed: true, detail: {tag_id: this.tag.id} }))
  }
  render() {
    if (this.tag.tag_type === "Category") {
        return html`
            <div class="tag-container">
                <div class="tag category">
                    ${this.tag.title}
                    <button class="icon-button" @click=${this.removeTag}>
                        <img src="./src/assets/icons/x-circle.svg"/>
                    </button>
                </div>
                <div class="menu-container">
                    ${this.parent_tags.map((tag: Tag) => {
                      html `<div class="parent-tag">${tag.title}</div>`
                    })};
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
