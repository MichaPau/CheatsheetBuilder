import { html, css, LitElement, PropertyValues } from 'lit';
//import { LitElementLightDOM } from './utils/litlightdom.js';
import { customElement, state, query } from 'lit/decorators.js';

import {provide} from '@lit/context';

import { Order, SearchOrder, Snippet} from './types';

import './components/categories.js';
import './components/header-comp.js';
import './components/snippet-list.js';
import './components/settings-logger.js';
import './components/drawer.js';
import './components/snippet/create-snippet.js';
// import './test/test-vanilla-comp.js';
// import './test/test-wrapper.js';


import mainStyles from './styles/mainStyle.js';
import sharedStyles from './styles/shared-styles.js';


import { AppData, appDataContext, appSettingContext, AppSettings } from './utils/app-context.js';

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

      drawer-comp {
        position: fixed;
        display: inline-block;
        width: 3rem;
        margin: 0 auto;
        bottom: 5px;
        transform: translateY(50%);
        transition: all 0.2s;
        right: 0;
        left: 0;

        &:hover {
            transform: translateY(25%);
        }
      }

      create-snippet {
        width: 500px;
        height: 300px;
      }
    `
  ];

  @provide({ context: appDataContext })
  @state()
  appData: AppData = {
    snippets: [],
    categories: [],
  };

  @provide({ context: appSettingContext })
  @state()
  appSettings: AppSettings = {
    open_categories: [],
    selected_categories: [],
    search_order: [
      { title: "title", value: "title", order: Order.NONE },
      { title: "created", value: "createdat", order: Order.NONE },
      { title: "updated", value: "updatedat", order: Order.NONE },
      { title: "nonvalid", value: "nonvalidcomumn", order: Order.NONE },
    ],
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
    save_search_order: (order: Array<SearchOrder>) => {
      this.appSettings = {...this.appSettings, search_order: order};
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

  public main_controller = new MainInvoker(this);

  constructor() {
    super();
    this.main_controller.load_data();
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

  }

  protected async firstUpdated(_changedProperties: PropertyValues) {
    //await new Promise(requestAnimationFrame);
    //this.main_controler.load_data();
  }


  render() {
    return html`
      <div id="layout-container">
        <header class="header">
        <div class="content-wrapper">
            <button @click=${this.toggleStyle}>Test</button>
            <header-comp></header-comp>
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
      <drawer-comp>
          <create-snippet></create-snippet>
      </drawer-comp>
    `;
  }
}
