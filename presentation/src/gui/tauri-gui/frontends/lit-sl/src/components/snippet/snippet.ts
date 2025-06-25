import { html, PropertyValues } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';

import sharedStyles from '../../styles/shared-styles.js';
import snippetStyles from './snippet-styles.js';
import { Snippet, Tag, SnippetInvoker } from '../../types.js';

import {BaseElement } from '../../utils/base-element.js';
import './snippet-editor.js';
import './snippet-tag-list.js';
import '../tag-search-bar.js';
import '../extern/mp-markdown-editor.js';
import { TagSearchBar } from '../tag-search-bar.js';

@customElement('snippet-item')
export class SnippetContainer extends BaseElement {
  static styles = [
    super.styles,
    sharedStyles,
    snippetStyles,
  ];

  @property({attribute: false})
  snippet!: Snippet;

  @query("#tag-search-bar")
  tagSearchBar!: TagSearchBar;

  @query("#footer")
  footer!: HTMLDetailsElement;

  connectedCallback(): void {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.footer.removeEventListener("toggle", this.toggleDetailsHandler);
  }
  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.footer.addEventListener("toggle", this.toggleDetailsHandler);
 }
  protected shouldUpdate(_changedProperties: PropertyValues): boolean {
    return super.shouldUpdate(_changedProperties);
  }

  toggleDetailsHandler = (_ev: Event) => {
    /* if (this.footer.open) {
      this.footer.focus();
    } */
  }

  onEditTitle = (ev: Event) => {
    const title_elem = ev.target! as HTMLInputElement;
    title_elem.readOnly = false;
  }
  onBlurTitle = async (ev: Event) => {

    const title_elem = ev.target! as HTMLInputElement;
    title_elem.readOnly = true;

    if (this.snippet.title !== title_elem.value) {
      await SnippetInvoker.updateTitle(this.snippet.id, title_elem.value, this)
        .then((_result_flag) => {
          super.showSuccess();
        })
        .catch((_err) => {
          super.showError();
          title_elem.value = this.snippet.title;
        })

    }
  }

  onBlurDetails = (ev: FocusEvent) => {

    if (!(ev.currentTarget as HTMLElement).contains(ev.relatedTarget as Node)) {

      const details_elem = ev.target as HTMLDetailsElement;
      details_elem.open = false;
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

  addTag = async (ev: CustomEvent) => {

    const tag: Tag = ev.detail.tag;
    const index = this.snippet.tags.findIndex(e => e.id === tag.id);
    if (index === -1) {
      //this.snippet_controler.addTag(id);
      await SnippetInvoker.addTag(tag.id, this.snippet.id, this)
        .then((tag_result) => {
          this.snippet = { ...this.snippet, tags: tag_result };
          super.showSuccess();
          this.tagSearchBar.clearResult();
        })
        .catch((_err) => {
          super.showError();
        })
    }
  }

  createTag = async (ev: CustomEvent) => {
    const title = ev.detail.label;
    await SnippetInvoker.createTagAndAdd(this.snippet.id, title, this).then((tag_result) => {
      this.snippet = { ...this.snippet, tags: tag_result };
      super.showSuccess();
      this.tagSearchBar.clearResult();
    }).catch((_err) => {
      super.showError();
    });
  }

  removeTag = async (ev:CustomEvent) => {

    await SnippetInvoker.removeTag(this.snippet.id, ev.detail.tag_id, this)
      .then((tag_result) => {
        this.snippet = { ...this.snippet, tags: tag_result };
      })
      .catch((_err) => {
        super.showError();
      })
  }

  async removeSnippet(_ev:Event) {
    await SnippetInvoker.deleteSnippet(this.snippet.id, this)
      .then((_result) => {
        this.dispatchEvent(new Event('reload-snippets', { bubbles: true, composed: true }));
      }).catch(_err => super.showError());
  }
  async editorContentUpdate(ev: CustomEvent) {
    await SnippetInvoker.updateTextContent(this.snippet.id, ev.detail.content_text, ev.detail.text_type, this)
      .then((_result) => {
        super.showSuccess();
      })
      .catch((_err) => {
        super.showError();
      });
  }

  async md_update(ev: CustomEvent) {
    await SnippetInvoker.updateTextContent(this.snippet.id, ev.detail, "Markdown", this)
      .then((_result) => {
        super.showSuccess();
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
                        @click=${this.onEditTitle}
                        @blur=${this.onBlurTitle}
                        @keydown=${this.onTitleKeyDown}
                        value=${this.snippet.title}
                        />
                    <button @click=${this.removeSnippet}>X</button>
            </div>
            <mp-markdown-editor id="editor" value=${this.snippet.text} @mp-markdown-update=${this.md_update}></mp-markdown-editor>
            <details id="footer" class="footer focusable" >
                <summary tabindex="0" @focusout=${this.onBlurDetails}><snippet-tag-list .tag_list=${this.snippet.tags} @remove-tag-from-snippet=${this.removeTag}></snippet-tag-list></summary>
                <tag-search-bar id="tag-search-bar" .recurrent-tags=${this.snippet.tags} @add-search-tag=${this.addTag} @create-search-tag=${this.createTag}></tag-search-bar>

            </details>
        </div>
    `;
  }
}
// <snippet-editor class="hide-focus" tabindex="0" id="editor-component" .text_data=${this.snippet.text} @editor-content-update=${this.editorContentUpdate}></snippet-editor>

