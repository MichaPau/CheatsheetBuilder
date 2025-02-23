import { ReactiveController, ReactiveControllerHost } from "lit";

import { App } from "../main.js";
//import { buildTreeArray } from '../utils/utils.js';
import { invoke } from "@tauri-apps/api/core";
import { CategoriesInvoker, Snippet} from "../types";


export default class MainInvoker implements ReactiveController {
  private host: App;
  private categories_invoker;
  constructor(host: ReactiveControllerHost & App) {
    this.host = host;
    this.host.addController(this);
    this.categories_invoker = new CategoriesInvoker(this.host);
  }

  async load_data() {
    //console.log("load data", this);
    const snippets = await invoke("get_snippets").catch(err => console.log(err)) as Array<Snippet>;
    const categories = await this.categories_invoker.load_categories();
    this.host.appData = { categories, snippets };
    //console.log(this.host.appData.snippets);
  }

  get_snippet_setting_params() {
    let order_strings: Array<object> | null = this.host.appSettings.search_order.map((item) => {
      return { column_name: item.value, order_dir: item.order };
      // switch (item.order) {
      //   case 1:
      //     return item.value + " ASC";
      //     return { columnName: item.value, orderDir: item.order };
      //     break;
      //   case 2:
      //     return item.value + " DESC";
      //     break;
      //   default:
      //     return "";
      // }
    });

    if (order_strings.length === 0) order_strings = null;
    let tag_filter = this.host.appSettings.selected_categories.length > 0 ? this.host.appSettings.selected_categories : null;
    let time_boundry = null;

    return {
      tagFilter: tag_filter,
      order: order_strings,
      timeBoundry: time_boundry,
    };
  }
  reload_data = async (_ev: Event) => {
    //console.log("reload data", this);
    const params = this.get_snippet_setting_params();
    const snippets = await invoke("get_snippets", params).catch(err => console.log(err)) as Array<Snippet>;
    const categories = await this.categories_invoker.load_categories();
    this.host.appData = { categories, snippets };
  }

  reload_snippets = async (_ev: Event) => {

    const params = this.get_snippet_setting_params();
    //console.log(params);
    const snippets = await invoke("get_snippets", params).catch(err => console.log(err)) as Array<Snippet>;

    this.host.appData = { ...this.host.appData, snippets };
  }



  hostConnected(): void {
    this.host.addEventListener('reload-snippets', this.reload_data);
    this.host.addEventListener('set-selected-categories', this.setSelectedCategories);
    this.host.addEventListener('reload_snippets-settings-change', this.reload_snippets);
  }
  setSelectedCategories(ev: CustomEvent) {
    let ids = (ev as CustomEvent).detail;
    console.log("main::setting ids: ",ids);
    this.host.appSettings = {...this.host.appSettings, selected_categories: ids};
  }

  hostDisconnected(): void {}
}
