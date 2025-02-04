import { html, css, LitElement, PropertyValues } from 'lit';
//import { LitElementLightDOM } from './utils/litlightdom.js';
import { customElement, state, query } from 'lit/decorators.js';

import {provide} from '@lit/context';

import { Snippet} from './types';

import './components/categories.js';
import './components/snippet-list.js';
import './components/settings-logger.js';
// import './test/test-vanilla-comp.js';
// import './test/test-wrapper.js';


import mainStyles from './styles/mainStyle.js';
import sharedStyles from './styles/shared-styles.js';


import { appContext, AppSettings } from './utils/app-context.js';

// const controllerModule = import.meta.env.VITE_USE_MOCK_DATA ? await import('./test-controllers/main-controller.js') : await import('./controllers/main-controller.js');
// const MainController: typeof controllerModule = controllerModule;
//import MainController from './controllers/main-controller.js';
import { MainInvoker } from './types.js';
import { Categories } from './components/categories.js';
import { SnippetList } from './components/snippet-list.js';
import { TreeNode } from './components/tree.js';
//import { MainController } from './test-controllers/main-controller.js';

//
//import { TreeNode } from './components/tree.js';



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
    open_categories: [],
    selected_categories: [],
    toggle_open: (id: number, state: boolean) => {
      let open_ids = this.appSettings.open_categories.filter(i => i !== id);;
      if (state) {
        open_ids.push(id);
      }
      this.appSettings = {...this.appSettings,  open_categories: open_ids };
    },
    save_selected: (ids: Array<number>) => {
      this.appSettings = {...this.appSettings,  selected_categories: ids };
    },
  };

  // @provide({ context: saveSettingsContext })
  // update_selection = (selected_ids: Array<number>) => {
  //   this.appSettings = {open_categories: this.appSettings.open_categories,  selected_categories: selected_ids };
  // }

  @state()
  categories: Array<TreeNode> = [];

  @query("category-tree")
  category_comp!: Categories;

  @query("snippet-list")
  snippet_list_comp!: SnippetList;

  @state()
  snippets: Array<Snippet> = [];

  private main_controler = new MainInvoker(this);

  constructor() {
    super();
    //this.main_controler.load_data();
    //console.log("USE_MOCK_DATA:", import.meta.env.VITE_USE_MOCK_DATA);
    //this.main_controler.init_handlers();

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
      console.log("main::setting ids: ",ids);
      this.appSettings = {...this.appSettings, selected_categories: ids};
    });
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.main_controler.load_data();
  }


  render() {
    return html`
      <div id="layout-container">
        <header class="header">
        <div class="content-wrapper">
            <button @click=${this.toggleStyle}>Test</button>
        </div>
          </header>
          <aside class="sidebar">
              <div class="content-wrapper">
            <category-tree .category_tree=${this.categories} id="category-tree" ></category-tree>
              </div>
          </aside>
          <main class="main-content">
              <div class="content-wrapper">
            <snippet-list id="snippet-list" .snippets=${this.snippets}></snippet-list>
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
