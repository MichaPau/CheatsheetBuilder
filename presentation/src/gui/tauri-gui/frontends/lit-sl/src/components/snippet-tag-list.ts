import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';


import sharedStyles from '../styles/shared-styles.js';
import { Tag } from '../types.js';

import './tag-item.js';
import { TagListController } from '../controllers/tag-list-controller.js';
import { TagItem } from './tag-item.js';

@customElement('snippet-tag-list')
export class SnippetTagList extends LitElement {
  static styles = [
    sharedStyles,
    css `
      :host {
        display: block;
      }

      .tag-container {
          display: flex;
          gap: var(--sl-spacing-2x-small);
      }

    `
  ];

  @state()
  state_var = false;

  @property({ attribute: false })
  tag_list!: Array<Tag>;

  private controller: TagListController = new TagListController(this);

  connectedCallback(): void {
    super.connectedCallback();
  }

  getParentTags = async (ev: CustomEvent) => {
    ev.stopImmediatePropagation();

    let result: Array<Tag> = await this.controller.getParentTags(ev.detail.id) as Array<Tag>;
    console.log(result);

    if (result.length > 0) {
      const t = ev.target as TagItem;
      t.showParents(result);
    }
  }
  render() {
    return html`
        <div class="tag-container">
        ${this.tag_list.map((tag) =>
            html`
               <tag-item .tag=${tag} @get-parent-tags=${this.getParentTags}></tag-item>
                `
        )}
        </div>
    `;
  }
}
