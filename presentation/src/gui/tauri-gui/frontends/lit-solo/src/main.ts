import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { Tag, Snippet, TreeCategory } from './types';

import './components/categories.js';
import './components/snippet_list.js';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tree/tree.js';
import '@shoelace-style/shoelace/dist/components/tree-item/tree-item.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';

import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/themes/dark.css';

import mainStyles from './styles/mainStyle.js';

import { buildTreeArray } from './utils/utils.js';
import { invoke } from "@tauri-apps/api/core";

@customElement('main-app')
export class App extends LitElement {
  static styles = [
    mainStyles,
    css `
      :host {
        display: block;
        border: 1px solid red;
        width: 100%;
        height: 100vh;
      }
    `
  ];

  @state()
  categories: Array<TreeCategory> = [];

  @state()
  snippets: Array<Snippet> = [];

  @state()
  styleFlag = false;

  constructor() {
    super();
    this.loadData();
    
  }

  async loadData() {
    const load_categories = await invoke("get_categories").catch(err => console.log(err)) as Array<Tag>;
    this.categories = buildTreeArray(load_categories);

    this.snippets = await invoke("get_snippets").catch(err => console.log(err)) as Array<Snippet>;
  }

  toggleStyle() {
    console.log("toggleStyle");
    const html_root = document.querySelector("html")!;
    if (html_root.classList.contains("sl-theme-dark")) {
      html_root.classList.remove("sl-theme-dark");
    } else {
      html_root.classList.add("sl-theme-dark");
    }
  }
  connectedCallback(): void {
    super.connectedCallback();
    console.log("connectedCallback");
  }
  render() {
    return html`
      <div id="app-container">
        <header class="header">
          <sl-button @click=${this.toggleStyle}>Test</sl-button>
          </header>
          <aside class="sidebar">

            <category-tree .category_tree=${this.categories}></category-tree>
          </aside>
          <main class="main-content">
            <snippet-list .snippets=${this.snippets}></snippet-list>
          </main>
          <footer class="footer">Footer</footer>
      </div>
    `;
  }
}
