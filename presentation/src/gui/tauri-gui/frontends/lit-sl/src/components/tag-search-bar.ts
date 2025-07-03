import { html, css, LitElement } from 'lit';
import { customElement, state, query, property } from 'lit/decorators.js';

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
        display: inline-block;
      }
      .tag-search-container {
        display: inline-grid;
        grid-template-columns: auto auto;
        grid-template-rows: auto auto;
        grid-template-areas:
        "label input"
        ". result";
      }
      #tag-search-result {
        grid-area: result;  
      }
      label {
        grid-area: label;
      }
      input {
        grid-area: input;
      }
    `
  ];

  @query("#tag-search-input")
  tagSearchInput!: HTMLInputElement;

  @query("#tag-search-result")
  tagSearchResult!: HTMLElement;

  @property()
  label = "Search tags:";
  
  @state()
  recurrent_tags: Array<Tag> = [];

  @state()
  allowNewTags: boolean = true;

  @state()
  min_char_trigger_search: number = 2;
  
  connectedCallback(): void {
    super.connectedCallback();
  }

  onSearchTagChange = async (_ev: Event) => {

    this.tagSearchResult.replaceChildren();

    let pattern = this.tagSearchInput.value;

    if (pattern.length >= this.min_char_trigger_search) {

      await SnippetInvoker.searchTags(pattern, this).then((tags) => {

        for (const t of tags) {

            var tag = document.createElement("div");
            tag.classList.add("tag");
            tag.tabIndex = 0;
            t.tag_type == "Category" ? tag.classList.add("category") : tag.classList.add("normal");

            tag.innerHTML = `${t.title}`;

            if (this.recurrent_tags.some(st => st.id === t.id)) {
              tag.classList.add("disabled");
            } else {

              tag.addEventListener("click", (_e) => this.dispatchEvent(new CustomEvent("add-search-tag", { bubbles: true, composed: true, detail: {tag: t} })));
              tag.addEventListener("keydown", (e:Event) => {
                if((e as KeyboardEvent).code  === 'Enter') {
                  this.dispatchEvent(new CustomEvent("add-search-tag", { bubbles: true, composed: true, detail: {tag: t} }));
                }
              });
            }
            this.tagSearchResult.appendChild(tag);
        }

        if (this.allowNewTags) {
          if (tags.findIndex((tag) => tag.title.toLowerCase() === pattern.toLowerCase()) === -1) {
            var tag = document.createElement("div");
            tag.classList.add("tag");
            tag.classList.add("create");
            tag.tabIndex = 0;
            tag.innerHTML = `${pattern}`;

            tag.addEventListener("click", (_e) => this.dispatchEvent(new CustomEvent("create-search-tag", { bubbles: true, composed: true, detail: { label: pattern } })));
            tag.addEventListener("keydown", (e:Event) => {
              if((e as KeyboardEvent).code  === 'Enter') {
                this.dispatchEvent(new CustomEvent("create-search-tag", { bubbles: true, composed: true, detail: { label: pattern } }));
              }
            });

            this.tagSearchResult.appendChild(tag);
          }
        }
      });
    }
  }

  onInputBlur(ev: Event) {
    ev.stopPropagation();
    ev.preventDefault();
  }

  focusInput() {
    this.tagSearchResult.focus();
  }
  clearResult() {
        this.tagSearchResult.replaceChildren();
        this.tagSearchInput.value = "";
        this.tagSearchInput.focus();
  }

  render() {
    return html`
        <div class="tag-search-container">
            <label part="label" for="tag-search-input">${this.label}</label>
            <input part="input" class="tag-search-input" id="tag-search-input" type="text" @input=${this.onSearchTagChange} @blur=${this.onInputBlur}></input>
            <div part="result" id="tag-search-result"></div>
        </div>
    `;
  }
}
