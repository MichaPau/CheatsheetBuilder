import { html, LitElement, PropertyValues } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';

import sharedStyles from '../../styles/shared-styles.js';
import snippetStyles from './snippet-styles.js';
import { Snippet, Tag, SnippetInvoker } from '../../types.js';
//import SnippetInvoker from '../../invokers/mock-invokers/snippet-invoker.js';

import './snippet-editor.js';
import './snippet-tag-list.js';

@customElement('snippet-item')
export class SnippetContainer extends LitElement {
  static styles = [
    sharedStyles,
    snippetStyles,
  ];

  @property({attribute: false})
  snippet!: Snippet;

  @query("#tag-search-input")
  tagSearchInput!: HTMLInputElement;

  @query("#tag-search-result")
  tagSearchResult!: HTMLElement;

  // private snippet_controler: SnippetInvoker = new SnippetInvoker(this);

  connectedCallback(): void {
    super.connectedCallback();
  }

  protected shouldUpdate(_changedProperties: PropertyValues): boolean {
    //console.log("Snippet::shouldUpdate", _changedProperties);
    return super.shouldUpdate(_changedProperties);
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
      // console.log("title changed!");
      await SnippetInvoker.updateTitle(this.snippet.id, title_elem.value)
        .then((_result_flag) => {})
        .catch((err) => {
          console.log(err);
          title_elem.value = this.snippet.title;
        })
      // let r = await this.snippet_controler.updateTitle(this.snippet.id, title_elem.value);
      // if(r === false) {
      //   title_elem.value = this.snippet.title;
      // }
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

    const index = this.snippet.tags.findIndex(e => e.id === id);
    if (index === -1) {
      //this.snippet_controler.addTag(id);
      await SnippetInvoker.addTag(id, this.snippet.id)
        .then((tag_result) => {
          this.snippet = { ...this.snippet, tags: tag_result };
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  removeTag = async (ev:CustomEvent) => {

    await SnippetInvoker.removeTag(this.snippet.id, ev.detail.tag_id)
      .then((tag_result) => {
        this.snippet = { ...this.snippet, tags: tag_result };
      })
      .catch((err) => {
        console.log(err);
      })
    //this.snippet_controler.removeTag(this.snippet.id, ev.detail.tag_id)
    //console.log("removetag: ", this.snippet.id, ev.detail.tag_id);

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
      console.log(SnippetInvoker.searchTags);
      let tags: Array<Tag> = await SnippetInvoker.searchTags(pattern);

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
            tag.addEventListener("click", (e) => this.addTag(t.id, e));
          }

          search_target?.appendChild(tag);

      }
    }
  }
  render() {
    return html`
        <div class="snippet-item card">
            <div id="header">
                    <input readonly class="snippet-title-label"
                        @click=${this.onEditTitle}
                        @blur=${this.onBlurTitle}
                        @keydown=${this.onTitleKeyDown}
                        value=${this.snippet.title}
                        />
            </div>
            <snippet-editor id="editor-component" .text_data=${this.snippet.text}></snippet-editor>
            <details id="footer" class="footer">
                <summary><snippet-tag-list .tag_list=${this.snippet.tags} @remove-tag-from-snippet=${this.removeTag}></snippet-tag-list></summary>
                <div class="tag-search-container">
                    <input class="tag-search-input" id="tag-search-input" type="text" @input=${this.onSearchTagChange}></input>
                    <div id="tag-search-result"></div>
                </div>
            </details>


        </div>

    `;
  }
}
