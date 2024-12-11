import { html, css, LitElement } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';

import mainStyles from '../styles/mainStyle.js';
import { Snippet } from '../types.js';

import { SnippetController } from '../controllers/snippet-controller.js';

import './snippet-editor.js';
import './snippet-tag-list.js';

@customElement('snippet-item')
export class SnippetContainer extends LitElement {
  static styles = [
    mainStyles,
    css `
      :host {
        display: block;
        width: 100%;
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
    // const label_elem = ev.target! as HTMLLabelElement;

    // label_elem.setAttribute("contenteditable", "plaintext-only");
    // label_elem.focus();

    const title_elem = ev.target! as HTMLInputElement;

    title_elem.readOnly = false;
    //label_elem.focus();
  }
  onBlurTitle = (ev: Event) => {
    console.log("onblutitle");
    // const label_elem = ev.target! as HTMLLabelElement;
    // label_elem.setAttribute("contenteditable", "false");
    // if (this.snippet.title !== label_elem.textContent) {
    //   console.log("title changed!");
    // }
    const title_elem = ev.target! as HTMLInputElement;
    title_elem.readOnly = true;

    if (this.snippet.title !== title_elem.value) {
      console.log("title changed!");
    }





  }
  onTitleKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === "Escape") {
      (ev.target! as HTMLElement).textContent = this.snippet.title;
      (ev.target! as HTMLElement).blur();

    }
    if (ev.key === "Enter") {
        (ev.target! as HTMLElement).blur();
    }
  }
  render() {
    return html`
        <sl-card class="snippet-item">
            <div slot="header">
                <!-- <label class="snippet-title-label"
                    @click=${this.onEditTitle}
                    @blur=${this.onBlurTitle}
                    @keydown=${this.onTitleKeyDown}
                    >${this.snippet.title}</label> -->
                    <input readonly class="snippet-title-label"
                        @click=${this.onEditTitle}
                        @blur=${this.onBlurTitle}
                        @keydown=${this.onTitleKeyDown}
                        value=${this.snippet.title}
                        />
            </div>
            <div slot="footer">
                <snippet-tag-list .tag_list=${this.snippet.tags}></snippet-tag-list>
            </div>

            <snippet-editor .text_data=${this.snippet.text}></snippet-editor>
        </sl-card>

    `;
  }
}
