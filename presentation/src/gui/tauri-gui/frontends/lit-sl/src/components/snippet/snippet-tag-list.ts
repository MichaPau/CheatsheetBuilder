import { html, css, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';


import sharedStyles from '../../styles/shared-styles.js';
import { Tag, TagListInvoker } from '../../types.js';


//import TagListController from '../invokers/mock-invokers/tag-list-invoker.js';
import { TagItem } from '../tag-item.js';
import '../tag-item.js';

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
          gap: var(--spacing-small);

      }
      .placeholder {
          color: var(--placeholder-color);
          cursor: pointer;
      }



    `
  ];

  @state()
  state_var = false;

  @property({attribute: false})
  tag_list!: Array<Tag>;

  //private controller: TagListInvoker = new TagListInvoker(this);

  protected shouldUpdate(_changedProperties: PropertyValues): boolean {
    //console.log("TagList::shouldUpdate", _changedProperties);
    return super.shouldUpdate(_changedProperties);
  }

  connectedCallback(): void {
    super.connectedCallback();
  }

  getParentTags = async (ev: CustomEvent) => {

    ev.stopPropagation();

    const tag_target = ev.composedPath()[0] as TagItem;

    const id = ev.detail.id;
    await TagListInvoker.getParentTags(id).then(result => {
      //console.log(t);
      tag_target.showParents(result);
    });

  }
  render() {
    return html`
        <div class="tag-container">
        ${this.tag_list.map((_tag) =>
            html`
              <tag-item .tag=${_tag} @get-parent-tags=${this.getParentTags}></tag-item>
                `
        )}
        ${this.tag_list.length === 0 ? html`<span class="placeholder">No tags</span>`: ``}
        </div>
    `;
  }
}
