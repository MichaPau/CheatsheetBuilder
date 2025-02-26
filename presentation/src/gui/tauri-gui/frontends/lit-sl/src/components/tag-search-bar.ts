import { html, css, LitElement } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';

import sharedStyles from '../styles/shared-styles.js';
import snippetStyles from './snippet/snippet-styles.js';
import { SnippetInvoker, Tag } from '../types.js';

@customElement('tag-search-bar')
export class TagSearchBar extends LitElement {
  static styles = [
    sharedStyles,
    snippetStyles,
    css `
      :host {
        display: block;
      }
    `
  ];

  @query("#tag-search-input")
  tagSearchInput!: HTMLInputElement;

  @query("#tag-search-result")
  tagSearchResult!: HTMLElement;

  @state()
  recurrent_tags: Array<Tag> = [];

  connectedCallback(): void {
    super.connectedCallback();
  }
  onSearchTagChange = async (_ev: Event) => {

    this.tagSearchResult.replaceChildren();

    let pattern = this.tagSearchInput.value;

    if (pattern.length >= 3) {
      console.log(SnippetInvoker.searchTags);
      let tags: Array<Tag> = await SnippetInvoker.searchTags(pattern);

      for (const t of tags) {

          var tag = document.createElement("div");
          tag.classList.add("tag");
          t.tag_type == "Category" ? tag.classList.add("category") : tag.classList.add("normal");

          tag.innerHTML = `${t.title}`;

          if (this.recurrent_tags.some(st => st.id === t.id)) {
            tag.classList.add("disabled");
          } else {

            tag.addEventListener("click", (_e) => this.dispatchEvent(new CustomEvent("add-search-tag", { bubbles: true, composed: true, detail: {tag: t} })));
          }
          this.tagSearchResult.appendChild(tag);
      }

      if(tags.findIndex((tag) => tag.title.toLowerCase() === pattern.toLowerCase()) === -1) {
        var tag = document.createElement("div");
        tag.classList.add("tag");
        tag.classList.add("create");

        tag.innerHTML = `${pattern}`;

        tag.addEventListener("click", (_e) => this.dispatchEvent(new CustomEvent("create-search-tag", { bubbles: true, composed: true, detail: {label: pattern} })));

        this.tagSearchResult.appendChild(tag);
      }
    }
  }
  clearResult() {
        //const search_target = this.shadowRoot?.querySelector("#tag-search-result");
        this.tagSearchResult.replaceChildren();
        //const search_input = this.shadowRoot?.querySelector(".tag-search-input") as HTMLInputElement;
        this.tagSearchInput.value = "";
  }
  render() {
    return html`
        <div class="tag-search-container">
            <input class="tag-search-input" id="tag-search-input" type="text" @input=${this.onSearchTagChange}></input>
            <div id="tag-search-result"></div>
        </div>
    `;
  }
}
