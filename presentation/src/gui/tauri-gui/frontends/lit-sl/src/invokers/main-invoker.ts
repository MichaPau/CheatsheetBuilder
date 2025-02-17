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

  reload_data = async (_ev: Event) => {
    //console.log("reload data", this);
    const snippets = await invoke("get_snippets").catch(err => console.log(err)) as Array<Snippet>;
    const categories = await this.categories_invoker.load_categories();
    this.host.appData = { categories, snippets };
  }



  hostConnected(): void {
    this.host.addEventListener('reload-snippets', this.reload_data);
    this.host.addEventListener('set-selected-categories', this.setSelectedCategories);
  }
  setSelectedCategories(ev: CustomEvent) {
    let ids = (ev as CustomEvent).detail;
    console.log("main::setting ids: ",ids);
    this.host.appSettings = {...this.host.appSettings, selected_categories: ids};
  }

  hostDisconnected(): void {}
}
