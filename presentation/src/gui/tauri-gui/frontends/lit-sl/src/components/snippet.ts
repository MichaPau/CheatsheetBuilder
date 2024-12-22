import { html, css, LitElement } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';

import sharedStyles from '../styles/shared-styles.js';
import { Snippet, Tag } from '../types.js';

import { SnippetController } from '../controllers/snippet-controller.js';

import './snippet-editor.js';
import './snippet-tag-list.js';

@customElement('snippet-item')
export class SnippetContainer extends LitElement {
  static styles = [
    sharedStyles,
    css `
      :host {
        display: block;
        width: 100%;


      }

      .snippet-item {
        flex: 1;
        width: 80%;
        --padding: var(--sl-spacing-small);
      }
      .snippet-item::part(body) {
        min-height: var(-snippet-body-min-height);
      }
      .snippet-title-label {
          display: block;
          line-height: 1.5em;
          width: 100%;
          /* border-radius: var(--sl-border-radius-medium); */

          &:read-only {
              border: none;
          }
      }
      .footer {
          display: flex;
          flex-direction: column;
          gap: var(--sl-spacing-2x-small);
          border: 1px solid black;
      }

    .tag-search-input {
        flex: 1 1 50%;


    }
    #tag-search-result {

        display: flex;
        gap: var(--sl-spacing-2x-small);

        &.option {
            appearance: none;
            background-color: transparent;
            border: 0;
            padding:10px;
            margin:-5px -20px -5px -5px;
        }
    }
    .test {
        display: inline-block;
    }



    `
  ];

  @property({attribute: false})
  snippet!: Snippet;

  @state()
  state_var = false;

  private snippet_controler: SnippetController = new SnippetController(this);

  connectedCallback(): void {
    super.connectedCallback();
  }



  onEditTitle = (ev: Event) => {
    console.log("onedittitle");
    const title_elem = ev.target! as HTMLInputElement;

    title_elem.readOnly = false;
    //label_elem.focus();
  }
  onBlurTitle = async (ev: Event) => {
    console.log("onblutitle");

    const title_elem = ev.target! as HTMLInputElement;
    title_elem.readOnly = true;

    if (this.snippet.title !== title_elem.value) {
      console.log("title changed!");
      let r = await this.snippet_controler.updateTitle(this.snippet.id, title_elem.value);
      if(r === false) {
        title_elem.value = this.snippet.title;
      }
    }
  }
  onTitleKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === "Escape") {
      (ev.target! as HTMLInputElement).value = this.snippet.title;
      (ev.target! as HTMLInputElement).blur();

    }
    if (ev.key === "Enter") {
        (ev.target! as HTMLElement).blur();
    }
  }

  addTag = async (id: number, _ev: Event) => {
    console.log("add tag: ", id);
    const index = this.snippet.tags.findIndex(e => e.id === id);
    if (index === -1) {
      this.snippet_controler.addTag(id);
    }
  }

  removeTag = async (ev:CustomEvent) => {

    this.snippet_controler.removeTag(this.snippet.id, ev.detail.tag_id)
    console.log("removetag: ", this.snippet.id, ev.detail.tag_id);

  }
  tagResult(new_tags: Array<Tag>, clear_search: boolean = false) {

    if (clear_search) {
      const search_target = this.shadowRoot?.querySelector("#tag-search-result");
      search_target?.replaceChildren();
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

          if (this.snippet.tags.includes(t)) {
            tag.setAttribute("disabled", "");
          } else {
            tag.addEventListener("click", (e) => this.addTag(t.id, e));
          }

          search_target?.appendChild(tag);

      }
    }
  }
  render() {
    return html`
        <sl-card class="snippet-item">
            <div slot="header">
                    <input readonly class="snippet-title-label"
                        @click=${this.onEditTitle}
                        @blur=${this.onBlurTitle}
                        @keydown=${this.onTitleKeyDown}
                        value=${this.snippet.title}
                        />
            </div>
            <div slot="footer" class="footer">
                <snippet-tag-list .tag_list=${this.snippet.tags} @remove-tag-from-snippet=${this.removeTag}></snippet-tag-list>
                <div class="tag-search-container">
                    <input class="tag-search-input" type="text" @input=${this.onSearchTagChange}></input>
                    <div id="tag-search-result"></div>

                </div>

            </div>

            <snippet-editor .text_data=${this.snippet.text}></snippet-editor>
        </sl-card>

    `;
  }
}
