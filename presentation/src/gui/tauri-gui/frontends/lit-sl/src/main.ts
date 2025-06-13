import { html, css, LitElement, PropertyValues } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';

import {provide} from '@lit/context';

import { Order, SearchOrder, Snippet, Log_Level} from './types';

import './components/categories.js';
import './components/header-comp.js';
import './components/snippet-list.js';
import './components/settings-logger.js';
import './components/drawer.js';
import './components/snippet/create-snippet.js';
import mainStyles from './styles/mainStyle.js';
import sharedStyles from './styles/shared-styles.js';
import {
  AppDataSnippets, appDataSnippetsContext,
  AppDataCategories, appDataCategoriesContext,
  AppSettings, appSettingContext  } from './utils/app-context.js';

import { MainInvoker } from './types.js';
import { Categories } from './components/categories.js';
import { SnippetList } from './components/snippet-list.js';
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

  @provide({ context: appDataSnippetsContext })
  @state()
  appDataSnippets: AppDataSnippets = {
    snippets: []
  };

  @provide({ context: appDataCategoriesContext })
  @state()
  appDataCategories: AppDataCategories = {
    categories: []
  };

  @provide({ context: appSettingContext })
  @state()
  appSettings: AppSettings = {
    open_categories: [],
    selected_categories: [],
    tag_filter: [],
    category_filter_flag: false,
    log_level: Log_Level.Debug,
    search_order: [
      { title: "title", value: "title", order: Order.NONE },
      { title: "created", value: "created_at", order: Order.NONE },
      { title: "updated", value: "updated_at", order: Order.NONE },
      // { title: "nonvalid", value: "nonvalidcomumn", order: Order.NONE },
    ],
    toggle_open: (id: number, state: boolean) => {
      let open_ids = this.appSettings.open_categories.filter(i => i !== id);;
      if (state) {
        open_ids.push(id);
      }
      this.appSettings = {...this.appSettings,  open_categories: open_ids };
    },
    set_category_filter_flag: (state) => {
      this.appSettings = {...this.appSettings,  category_filter_flag: state };
    },
    save_selected: (ids: Array<number>) => {
      this.appSettings = {...this.appSettings,  selected_categories: ids };
    },
    save_search_order: (order: Array<SearchOrder>) => {
      this.appSettings = {...this.appSettings, search_order: order};
    },
    save_tag_filter: (tags: Array<number>) => {
      this.appSettings = { ...this.appSettings, tag_filter: tags };
    }
  };

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
  }

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
  }

  protected async firstUpdated(_changedProperties: PropertyValues) {
    //
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
