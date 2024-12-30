import { html, css, LitElement, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import {cache} from 'lit/directives/cache.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import SlTextarea from '@shoelace-style/shoelace/dist/components/textarea/textarea.component.js';

import sharedStyles from '../styles/shared-styles.js';
import mdStyles from '../styles/markdown-styles.js';

//import { md } from '../types.js';
//import markdownit from 'markdown-it';
import { marked } from 'marked';

type Editor = HTMLTextAreaElement;
@customElement('snippet-editor')
export class SnippetEditor extends LitElement {
  static styles = [
    sharedStyles,
    mdStyles,
    css `
      :host {
        display: block;
        --snippet-body-min-height: 5em;
        --snippet-body-max-height: 11em;

      }
      .editor-container {
          display: flex;
          width: 100%;
          gap: 0.5em;
          max-height: var(--snippet-body-max-height);
          min-height: var(--snippet-body-min-height);
      }
      .editor-div {
          flex: 1 1 50%;
          transition: all 0.3s;
          min-width: 0;
          max-height: var(--snippet-body-max-height);
      }
      .editor {
          /* display: inline-block; */
          box-sizing: border-box;
          width: 100%;
          resize: vertical;
          height: 100%;
          max-height: 100%;
          min-height: var(--snippet-body-min-height);
          padding: var(--spacing-small) 0 0 var(--spacing-small) ;

          /* &:focus {
              //outline: var(--sl-focus-ring-style) var(--sl-focus-ring-width) var(--sl-focus-ring-color);
              outline: none;
              border: var(--sl-focus-ring-style) var(--sl-focus-ring-width) var(--sl-focus-ring-color);
          } */
      }
      .render-container {
          flex: 1 1 50%;
          border: 1px solid black;
          padding: var(--spacing-small) 0 0 var(--spacing-small);
          transition: all 0.3s;


      }
      .full {
          flex: 1 1 100%;
      }
      .half {
          flex: 1 1 50%;
          opacity: 1;
      }
      .closed {
          flex: 0 0 0%;
          opacity: 0;
      }

      /* sl-textarea {
          min-width: 0;
          height:100%;
          //max-height: 10em;
      } */
      /* sl-textarea::part(base) {
          max-height: 10em;
      } */
      /* sl-textarea::part(form-control) {
          max-height: 10em;
      } */
      /* sl-textarea::part(textarea) {
          resize: vertical;
          overflow-y: scroll;
          max-height: 15em;
      } */


      //.textarea--medium .textarea__control { padding: 0em var(--sl-input-spacing-medium); }
    `
  ];

  // @property({ attribute: false })
  // text_data: string = "";

  @state()
  render_data: string = "";

  private _edit_mode = false;

  @state()
  set edit_mode(value: boolean) {
    if(value) {
      this.render_container.classList.replace("full", "half");
      this.editor_div.classList.replace("closed", "half");
    } else {
      this.render_container.classList.replace("half", "full");
      this.editor_div.classList.replace("half", "closed");
    }
    this._edit_mode = value;
  }

  get edit_mode() { return this._edit_mode; }

  @query(".render-container")
  render_container!: HTMLElement;

  @query(".editor-div")
  editor_div!: HTMLElement;

  //md: markdownit | undefined;


  // render_data: string = "";

  private _text_data: string = "";
  @property()
  set text_data(value: string) {
    this._text_data = value;
    this.render_data = this.parseMarkdown(this.text_data);
  };

  get text_data() { return this._text_data };

  constructor() {
    super();
  }
  connectedCallback(): void {
    super.connectedCallback();
  }
  protected firstUpdated(_changedProperties: PropertyValues): void {
    //this.render_data = marked.parse(this.text_data, { async: false });
  }

  private parseMarkdown(value: string) {
    return marked.parse(value, { async: false });
  }
  onFocusText = (ev: Event) => {
    (ev.target as Editor).removeAttribute("readonly");
  }
  onBlurText = (ev: Event) => {
    const editor = (ev.target as Editor);
    editor.setAttribute("readonly", "");

    if (editor.value !== this.text_data) {
      this.text_data = editor.value;
      this.render_data = this.parseMarkdown(this.text_data);
    }

    this.edit_mode = false;


  }

  onEditorKeyDown(ev: KeyboardEvent) {

    if (ev.key === "Escape") {
      (ev.target! as Editor).value = this._text_data;
      (ev.target! as Editor).setAttribute("readonly", "");
      this.edit_mode = false;
      //this.render_container.classList.add("open");

    }
  }

  async onClickRender(_ev:Event) {
    this.edit_mode = true;
    //this.render_container.classList.remove("open");
    await this.updateComplete;
    if (this.edit_mode) {
      (this.shadowRoot?.querySelector(".editor") as Editor).focus();
    }
  }


  render() {

    let editor_node;
    if (this.edit_mode) {
       editor_node =  html`

           <textarea class="editor" .value=${this.text_data}
               @focus=${this.onFocusText}
               @blur=${this.onBlurText}
               @keydown=${this.onEditorKeyDown}
            ></textarea>
        `;
    } else {
          editor_node = html``;
    }
    return html`
        <div class="editor-container">
            <div class="editor-div closed">
                 ${cache(editor_node)}
            </div>

            <div class="render-container full" @click=${this.onClickRender}>
                ${unsafeHTML(this.render_data)}
            </div>
        </div>
    `;
  }
}

// <sl-textarea class="editor" size="medium" resize="auto" readonly
//     @sl-focus=${this.onFocusText}
//     @sl-blur=${this.onBlurText} value="${this.text_data}"
//     @keydown=${this.onEditorKeyDown}>
// </sl-textarea>
