import { html, LitElement } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';


import sharedStyles from '../../styles/shared-styles.js';
import snippetStyles from './snippet-styles.js';
import { Snippet, SnippetInvoker, Tag } from '../../types.js';

import './snippet-editor.js';
import './snippet-tag-list.js';
import { SnippetEditor } from './snippet-editor.js';
import { Drawer } from '../drawer.js';


@customElement('create-snippet')
export class CreateSnippet extends LitElement {
  static styles = [
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

  @query("#tag-search-input")
  tagSearchInput!: HTMLInputElement;

  @query("#tag-search-result")
  tagSearchResult!: HTMLElement;

  //private snippet_controler: SnippetInvoker = new SnippetInvoker(this);

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
  addTag = async (tag: Tag, _ev: Event) => {
    //console.log("create-snippet::addTag", tag);
    if (this.tags.findIndex((_t => _t.id === tag.id)) == -1) {
      const tags = this.tags.concat(tag);
      this.tags = [...tags];
      const search_target = this.shadowRoot?.querySelector("#tag-search-result");
      search_target?.replaceChildren();
    }
  }

  removeTag = async (ev:CustomEvent) => {
    //console.log("create-snippet::removeTag", ev.detail.tag_id);
    let tags = this.tags.filter((_t => _t.id !== ev.detail.tag_id));
    this.tags = [...tags];

  }
  // tagResult(new_tags: Array<Tag>, clear_search: boolean = false) {

  //   if (clear_search) {
  //     const search_target = this.shadowRoot?.querySelector("#tag-search-result");
  //     search_target?.replaceChildren();
  //     const search_input = this.shadowRoot?.querySelector(".tag-search-input") as HTMLInputElement;
  //     search_input.value = "";
  //   }
  //   this.snippet.tags = new_tags;
  //   this.requestUpdate();
  // }
  onSearchTagChange = async (ev: Event) => {

    this.tagSearchResult.replaceChildren();

    let pattern = (ev.target as HTMLInputElement).value;

    if (pattern.length >= 3) {

      //let tags: Array<Tag> = await this.snippet_controler.searchTags(pattern);
      let tags: Array<Tag> = await SnippetInvoker.searchTags(pattern);

      for (const t of tags) {

          var tag = document.createElement("div");
          //tag.setAttribute("tabindex", "0");
          tag.classList.add("tag");
          t.tag_type == "Category" ? tag.classList.add("category") : tag.classList.add("normal");

          tag.innerHTML = `${t.title}`;

          if (this.tags.some(st => st.id === t.id)) {
            console.log("tag already included");
            tag.classList.add("disabled");
          } else {
            tag.addEventListener("click", (e) => this.addTag(t, e));
          }

          this.tagSearchResult.appendChild(tag);

      }
    }
  }

  clearAndClose() {
    this.titleInput.value = "";
    this.tagSearchInput.value = "";

    this.editorComponent.text_data = "";
    this.tags = [];

    this.tagSearchResult.replaceChildren();

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
    const snippet: Snippet = { id: 0, title: this.titleInput.value, text: this.editorComponent.text_data, tags: this.tags, text_type: "Markdown", created_at: 0, updated_at: 0 };;
    //this.dispatchEvent(new CustomEvent('create-snippet', { detail: { snippet: snippet }, bubbles: true, composed: true }));
    await SnippetInvoker.createSnippet(snippet)
      .then((_) => {
        this.dispatchEvent(new Event('reload-snippets', { bubbles: true, composed: true}));
        this.clearAndClose();
      })
      .catch((err) => {
        console.log(err);
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
                <div class="tag-search-container">
                    <input id="tag-search-input" class="tag-search-input" type="text" @input=${this.onSearchTagChange}></input>
                    <div id="tag-search-result"></div>
                </div>
            </details>
            <div>
                <input type="button" value="Cancel" @click=${this.onCancel}>
                <input type="button" value="Save" @click=${this.onSave}>
            </div>

        </div>

    `;
  }
}
