import { html, css, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import SlTextarea from '@shoelace-style/shoelace/dist/components/textarea/textarea.component.js';

import mainStyles from '../styles/mainStyle.js';

//import { md } from '../types.js';
//import markdownit from 'markdown-it';
import { marked, options } from 'marked';

@customElement('snippet-editor')
export class SnippetEditor extends LitElement {
  static styles = [
    mainStyles,
    css `
      :host {
        display: block;
      }
      .editor-container {
          display: flex;
          width: 100%;
      }
      .editor {
          flex: 1 1 50%;
      }
      .render-container {
          flex: 1 1 50%;
          border: 1px solid black;
          padding: 0.5em var(--sl-input-spacing-medium);

      }
      //.textarea--medium .textarea__control { padding: 0em var(--sl-input-spacing-medium); }
    `
  ];

  @property({ attribute: false })
  text_data: string = "";

  @state()
  render_data: string = "";

  //md: markdownit | undefined;

  constructor() {
    super();


  }
  // render_data: string = "";

  // private _text_data: string = "";
  // @property()
  // set text_data(value: string) {
  //   this._text_data = value
  //   this.render_data = value
  // };

  // get text_data() {return this._text_data };


  connectedCallback(): void {
    super.connectedCallback();
    //this.md = markdownit();
    //this.render_data = this.md!.render(this.text_data);
    this.render_data = marked.parse(this.text_data, { async: false });

  }
  protected firstUpdated(_changedProperties: PropertyValues): void {
    //this.render_data = marked.parse(this.text_data, { async: false });
  }
  onFocusText = (ev: Event) => {
    (ev.target as SlTextarea).removeAttribute("readonly");
  }
  onBlurText = (ev: Event) => {
    (ev.target as SlTextarea).setAttribute("readonly", "");
  }

  render() {
    return html`
        <div class="editor-container">
            <sl-textarea class="editor" size="medium" readonly @sl-focus=${this.onFocusText} @sl-blur=${this.onBlurText} value="${this.text_data}"></sl-textarea>
            <div class="render-container">
                ${unsafeHTML(this.render_data)}
            </div>
        </div>
    `;
  }
}
