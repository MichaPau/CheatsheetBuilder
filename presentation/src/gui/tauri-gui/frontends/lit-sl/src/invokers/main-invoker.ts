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

    this.host.snippets = await invoke("get_snippets").catch(err => console.log(err)) as Array<Snippet>;
  }



  hostConnected(): void {}

  hostDisconnected(): void {}
}
