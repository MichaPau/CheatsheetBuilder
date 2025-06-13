import { ReactiveController, ReactiveControllerHost } from "lit";

import { App } from "../main.js";

// import { invoke } from "@tauri-apps/api/core";
// import { invoke } from "../;
// this.host.dispatchEvent(new CustomEvent('invoke-debugi, {detail: {info: "success", cmd: "load_data", args: {ke}rs;/mock-invokers/mockData";
import { invoke, Log_Level } from "../types";
import { CategoriesInvoker, Snippet } from "../types";
  // this.host.dispatchEvent(new CustomEvent('invoke-debugi, {detail: errorinfo: "success", cmd: err: {ke}rs;/mock-invokers/mockData";

export default class MainInvoker implements ReactiveController {
  private host: App;
  private categories_invoker;

  constructor(host: ReactiveControllerHost & App) {
    this.host = host;
    this.host.addController(this);
    this.categories_invoker = new CategoriesInvoker(this.host);
  }

  async load_data() {
    this.load_snippets();
    this.categories_invoker.load_categories();
  }

  async load_snippets() {
    
    const params = this.get_snippet_setting_params();
    await invoke("get_snippets", params).then((result) => {
      const snippets = result as Array<Snippet>;
      this.host.appDataSnippets = { snippets };
        this.host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "load_data: success", cmd: "get_snippets", args: { params } }, composed: true, bubbles: true}));
    }).catch((err) => {
       this.host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "load_data: " + err, cmd: "get_snippets", args: { params } }, composed: true, bubbles: true}));
    });

  }

  reload_data = async (_ev: Event) => {
    this.load_snippets();
    this.categories_invoker.load_categories();
  }

  reload_snippets = async (_ev: Event) => {
    this.load_snippets();
  }

  get_snippet_setting_params() {
    let order_strings: Array<object> | null = this.host.appSettings.search_order.filter((item) => item.order !== 0).map((item) => {
        return { column_name: item.value, order_dir: item.order };
    });

    if (order_strings.length === 0) order_strings = null;
    let cat_filter = this.host.appSettings.category_filter_flag ? this.host.appSettings.selected_categories : [];
    let tag_filter: Array<number> | null = [...this.host.appSettings.tag_filter, ...cat_filter];
    if (tag_filter.length === 0) {
      tag_filter = null;
    }
    let time_boundry = null;

    return {
      tagFilter: tag_filter,
      order: order_strings,
      timeBoundry: time_boundry,
    };
  }


  invoke_debug = async (ev: Event) => {
    if (this.host.appSettings.log_level >= Log_Level.Debug) {
      console.log("Debug: %o", (ev as CustomEvent).detail);
      if (this.host.appSettings.log_level >= Log_Level.Debug_With_Stack) {
        var stackTrace = Error().stack;
        console.log(stackTrace);
      }
    }
  }
  invoke_error = async (ev: Event) => {
    console.log("Error: %o", (ev as CustomEvent).detail);
  }

  hostConnected(): void {
    this.host.addEventListener('reload-snippets', this.reload_data);
    this.host.addEventListener('set-selected-categories', this.setSelectedCategories);
    this.host.addEventListener('reload-snippets-settings-change', this.reload_snippets);

    this.host.addEventListener('invoke-debug', this.invoke_debug);
    this.host.addEventListener('invoke-error', this.invoke_error);
  }
  setSelectedCategories(ev: CustomEvent) {
    let ids = (ev as CustomEvent).detail;
    this.host.appSettings = {...this.host.appSettings, selected_categories: ids};
  }

  hostDisconnected(): void {}
}
