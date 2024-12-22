import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {provide} from '@lit/context';

import { Tag, Snippet, TreeCategory } from './types';

import './components/categories.js';
import './components/snippet-list.js';
import './components/settings-logger.js';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/tree/tree.js';
import '@shoelace-style/shoelace/dist/components/tree-item/tree-item.js';


// import '@shoelace-style/shoelace/dist/themes/light.css';
// import '@shoelace-style/shoelace/dist/themes/dark.css';

// import './styles/light.css';
// import './styles/dark.css'

import mainStyles from './styles/mainStyle.js';
import sharedStyles from './styles/shared-styles.js';


import { appContext, AppSettings } from './utils/app-context.js';
import { MainController } from './controllers/main-controller.js';
//import { MainController } from './test-controllers/main-controller.js';

import { getBasePath, setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
setBasePath('./src');
console.log("path:", getBasePath());

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
    open_categories: ["1"],
    selected_categories: ["2"],
  };

  @state()
  categories: Array<TreeCategory> = [];

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
    if (html_root.classList.contains("sl-theme-dark")) {
      html_root.classList.remove("sl-theme-dark");
    } else {
      html_root.classList.add("sl-theme-dark");
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
      <div id="app-container">
        <header class="header">
          <sl-button @click=${this.toggleStyle}>Test</sl-button>
          <sl-icon-button name="x-circle" label="remove tag"></sl-icon-button>
          </header>
          <aside class="sidebar">
            <category-tree .category_tree=${this.categories}></category-tree>
          </aside>
          <main class="main-content">
            <snippet-list .snippets=${this.snippets}></snippet-list>
          </main>
          <footer class="footer">
              <settings-logger></settings-logger>
          </footer>
      </div>
    `;
  }
}
