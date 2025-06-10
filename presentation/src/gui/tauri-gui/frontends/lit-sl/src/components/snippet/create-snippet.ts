import { html} from 'lit';
import { customElement, state, query } from 'lit/decorators.js';


import sharedStyles from '../../styles/shared-styles.js';
import snippetStyles from './snippet-styles.js';
import { Snippet, SnippetInvoker, Tag } from '../../types.js';

import './snippet-editor.js';
import './snippet-tag-list.js';
import '../tag-search-bar.js';
import { SnippetEditor } from './snippet-editor.js';
import { TagSearchBar } from '../tag-search-bar.js';
import { Drawer } from '../drawer.js';
import { BaseElement } from '../../utils/base-element.js';


@customElement('create-snippet')
export class CreateSnippet extends BaseElement {
  static styles = [
    super.styles,
    sharedStyles,
    snippetStyles,
  ];

  @state()
  creation_state: "draft" | "saved" = "draft";

  @state()
  tags: Array<Tag> = [];

  @query("#title-input")
  titleInput!: HTMLInputElement;

  @query("#editor-component")
  editorComponent!: SnippetEditor;

  @query("#tag-search-bar")
  tagSearchBar!: TagSearchBar;

  connectedCallback(): void {
    super.connectedCallback();
  }
  onEditTitle = (ev: Event) => {
    const title_elem = ev.target! as HTMLInputElement;
    title_elem.readOnly = false;

  }
  onBlurTitle = async (ev: Event) => {
    const title_elem = ev.target! as HTMLInputElement;
    title_elem.readOnly = true;

  }
  onTitleKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === "Escape") {
      (ev.target! as HTMLInputElement).value = "";
      (ev.target! as HTMLInputElement).blur();

    }
    if (ev.key === "Enter") {
        (ev.target! as HTMLElement).blur();
    }
  }
  addTag = async (ev: CustomEvent) => {

    const add_tag = ev.detail.tag;
    if (this.tags.findIndex((_t => _t.id === add_tag.id)) == -1) {
      const tags = this.tags.concat(add_tag);
      this.tags = [...tags];
      this.tagSearchBar.clearResult();
    }
  }
  createTag = async (ev: CustomEvent) => {
    const title = ev.detail.label;
    await SnippetInvoker.createTag(title, this).then((tag_result) => {
      const tags = this.tags.concat(tag_result);
      this.tags = [...tags];
      this.tagSearchBar.clearResult();
    }).catch((_err) => {
      super.showError();
    });
  }

  removeTag = async (ev:CustomEvent) => {
    let tags = this.tags.filter((_t => _t.id !== ev.detail.tag_id));
    this.tags = [...tags];

  }

  clearAndClose() {
    this.titleInput.value = "";
    //this.tagSearchInput.value = "";

    this.editorComponent.text_data = "";
    this.tags = [];

    //this.tagSearchResult.replaceChildren();

    const t = this.shadowRoot?.host!;
    const p = t.parentElement as Drawer;
    if(p) {
      p.close();
    }

  }
  onCancel= (_ev:Event) => {
    this.clearAndClose();

  }

  async onSave(_ev: Event) {
    const snippet: Snippet = { id: 0, title: this.titleInput.value, text: this.editorComponent.text_data, tags: this.tags, text_type: "Markdown", created_at: 0, updated_at: 0 };
    await SnippetInvoker.createSnippet(snippet, this)
      .then((_) => {
        this.dispatchEvent(new Event('reload-snippets', { bubbles: true, composed: true}));
        this.clearAndClose();
      })
      .catch((_err) => {
        super.showError();
      });

  }
  render() {

    return html`

        <div class="snippet-item card">
            <div id="header">
                <input readonly class="snippet-title-label"
                    id="title-input"
                    @click=${this.onEditTitle}
                    @blur=${this.onBlurTitle}
                    @keydown=${this.onTitleKeyDown}
                    value=""
                    />
            </div>
            <snippet-editor id="editor-component"></snippet-editor>
            <details id="footer" class="footer">
                <summary><snippet-tag-list .tag_list=${this.tags} @remove-tag-from-snippet=${this.removeTag}></snippet-tag-list></summary>
                <tag-search-bar id="tag-search-bar" .recurrent-tags=${this.tags} @add-search-tag=${this.addTag} @create-search-tag=${this.createTag}></tag-search-bar>
            </details>
            <div>
                <button type="button" @click=${this.onCancel}>Cancel</button>
                <button type="button" @click=${this.onSave}>Save</button>
            </div>

        </div>

    `;
  }
}
