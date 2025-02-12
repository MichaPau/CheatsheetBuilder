import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {live} from 'lit/directives/live.js';

import sharedStyles from '../../styles/shared-styles.js';
import snippetStyles from './snippet-styles.js';
import { Snippet, SnippetInvoker, Tag } from '../../types.js';

import './snippet-editor.js';
import './snippet-tag-list.js';

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

  private default_snippet: Snippet = { id: 0, tags: [], text: "", title: "", created_at: 0, updated_at: 0, text_type: "Markdown" };

  @state()
  snippet: Snippet = this.default_snippet;


  private snippet_controler: SnippetInvoker = new SnippetInvoker(this);

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
    if (this.snippet.tags.findIndex((_t => _t.id === tag.id)) == -1) {
      const tags = this.snippet.tags.concat(tag);
      this.snippet = { ...this.snippet, tags };
      const search_target = this.shadowRoot?.querySelector("#tag-search-result");
      search_target?.replaceChildren();
    }
  }

  removeTag = async (ev:CustomEvent) => {
    //console.log("create-snippet::removeTag", ev.detail.tag_id);
    let tags = this.snippet.tags.filter((_t => _t.id !== ev.detail.tag_id));
    this.snippet = { ...this.snippet, tags };

  }
  tagResult(new_tags: Array<Tag>, clear_search: boolean = false) {

    if (clear_search) {
      const search_target = this.shadowRoot?.querySelector("#tag-search-result");
      search_target?.replaceChildren();
      const search_input = this.shadowRoot?.querySelector(".tag-search-input") as HTMLInputElement;
      search_input.value = "";
    }
    this.snippet.tags = new_tags;
    this.requestUpdate();
  }
  onSearchTagChange = async (ev: Event) => {
    const search_target = this.shadowRoot?.querySelector("#tag-search-result");
    search_target?.replaceChildren();

    let pattern = (ev.target as HTMLInputElement).value;

    if (pattern.length >= 3) {

      let tags: Array<Tag> = await this.snippet_controler.searchTags(pattern);

      for (const t of tags) {

          var tag = document.createElement("div");
          //tag.setAttribute("tabindex", "0");
          tag.classList.add("tag");
          t.tag_type == "Category" ? tag.classList.add("category") : tag.classList.add("normal");

          tag.innerHTML = `${t.title}`;

          if (this.snippet.tags.some(st => st.id === t.id)) {
            console.log("tag already included");
            tag.classList.add("disabled");
          } else {
            tag.addEventListener("click", (e) => this.addTag(t, e));
          }

          search_target?.appendChild(tag);

      }
    }
  }

  clearAndClose() {

  }
  onCancel= (_ev:Event) => {

    //this.snippet = { ...this.default_snippet };
    this.snippet = { id: 10000, tags: [], text: "", title: "", created_at: 0, updated_at: 0, text_type: "Markdown" };
    console.log("create-snippet::onCancel", this.snippet);
    //his.requestUpdate();
  }

  onSave(_ev: Event) {
    this.dispatchEvent(new CustomEvent('create_snippet', { detail: { snippet: this.snippet }, bubbles: true, composed: true }));
  }
  render() {
    return html`
        <div class="snippet-item card">
            <div id="header">
                <input readonly class="snippet-title-label"
                    @click=${this.onEditTitle}
                    @blur=${this.onBlurTitle}
                    @keydown=${this.onTitleKeyDown}
                    .value=${live(this.snippet.title)}
                    />
            </div>
            <snippet-editor id="editor-component" .text_data=${live(this.snippet.text)}></snippet-editor>
            <details id="footer" class="footer">
                <summary><snippet-tag-list .tag_list=${this.snippet.tags} @remove-tag-from-snippet=${this.removeTag}></snippet-tag-list></summary>
                <div class="tag-search-container">
                    <input class="tag-search-input" type="text" @input=${this.onSearchTagChange}></input>
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
