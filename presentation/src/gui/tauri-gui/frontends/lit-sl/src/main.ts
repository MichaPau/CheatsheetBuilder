import { html, css, LitElement } from 'lit';
//import { LitElementLightDOM } from './utils/litlightdom.js';
import { customElement, state } from 'lit/decorators.js';
import {provide} from '@lit/context';

import { Snippet} from './types';

import './components/categories.js';
import './components/snippet-list.js';
import './components/settings-logger.js';

import mainStyles from './styles/mainStyle.js';
import sharedStyles from './styles/shared-styles.js';


import { appContext, AppSettings, SaveSettings, saveSettingsContext } from './utils/app-context.js';
//import { MainController } from './controllers/main-controller.js';
import { MainController } from './test-controllers/main-controller.js';
import { TreeNode } from './components/tree.js';



@customElement('main-app')
export class App extends LitElement {
  static styles = [
    mainStyles,
    sharedStyles,
    css `

      :host {
        display: block;
        border: 1px solid red;
        width: 100%;
        height: 100vh;
      }
    `
  ];

  @provide({ context: appContext })
  @state()
  appSettings: AppSettings = {
    open_categories: [1, 2],
    selected_categories: [],
  };

  @provide({ context: saveSettingsContext })
  update_selection = (selected_ids: Array<number>) => {
    console.log("update_selection");
    this.appSettings = {open_categories: this.appSettings.open_categories,  selected_categories: selected_ids };
  }

  @state()
  categories: Array<TreeNode> = [];

  @state()
  snippets: Array<Snippet> = [];

  private main_controler: MainController = new MainController(this);

  constructor() {
    super();
    this.main_controler.load_data();
    this.main_controler.init_handlers();

  }

  // async loadData() {
  //   const load_categories = await invoke("get_categories").catch(err => console.log(err)) as Array<Tag>;
  //   this.categories = buildTreeArray(load_categories);

  //   this.snippets = await invoke("get_snippets").catch(err => console.log(err)) as Array<Snippet>;
  // }

  toggleStyle() {
    console.log("toggleStyle");
    const html_root = document.querySelector("html")!;
    if (html_root.classList.contains("app-theme-light")) {
      html_root.classList.remove("app-theme-light");
      html_root.classList.add("app-theme-dark");
    } else {
      html_root.classList.remove("app-theme-dark");
      html_root.classList.add("app-theme-light");
    }
  }
  connectedCallback(): void {
    super.connectedCallback();
    console.log("connectedCallback main");
    this.addEventListener("set-selected-categories", (ev: Event) => {
      let ids = (ev as CustomEvent).detail;
      console.log("setting ids: ",ids);
      //this.appSettings.selected_categories = ids;
      this.appSettings = {...this.appSettings, selected_categories: ids};
    });
  }
  render() {
    return html`
      <div id="layout-container">
        <header class="header">
        <div class="content-wrapper">
          <button @click=${this.toggleStyle}>Test</button>
          <button @click=${(_ev: Event) => console.log(JSON.stringify(this.categories, null, 2))}>Debug</button>
          <sl-icon-button name="x-circle" label="remove tag"></sl-icon-button>
        </div>
          </header>
          <aside class="sidebar">
              <div class="content-wrapper">
            <category-tree .category_tree=${this.categories}></category-tree>
              </div>
          </aside>
          <main class="main-content">
              <div class="content-wrapper">
            <snippet-list .snippets=${this.snippets}></snippet-list>
              </div>
          </main>
          <footer class="footer">
              <div class="content-wrapper">
              <settings-logger></settings-logger>
              </div>
          </footer>
      </div>
    `;
  }
}
