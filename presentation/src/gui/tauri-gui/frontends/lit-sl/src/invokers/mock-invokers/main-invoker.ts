import { ReactiveController, ReactiveControllerHost } from "lit";

import { App } from "../../main.js";

import { snippets } from "./mockData.js";


import { CategoriesInvoker } from '../../types.js';

export default class MainInvoker implements ReactiveController {
  private host: App;
  private categories_invoker;

  constructor(host: ReactiveControllerHost & App) {
    this.host = host;
    this.host.addController(this);
    this.categories_invoker = new CategoriesInvoker(this.host);
  }

  async load_data() {
    this.host.snippets = snippets;
  }

  hostConnected(): void {
    console.log("MainInvoker::hostConnected");

  }

  hostDisconnected(): void {}
}
