import { ReactiveController, ReactiveControllerHost } from "lit";

import { App } from "../../main.js";

import { snippets, get_snippets } from "./mockData.js";


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

    //this.host.snippets = snippets;
    this.host.appData.snippets = get_snippets();
  }

  hostConnected(): void {
    this.host.addEventListener('create_snippet', (ev: CustomEvent) => {
      console.log("MainMockInvoker::create snippet");
      let new_id = Math.max(...snippets.map(s => s.id)) + 1;
      let new_snippet = ev.detail.snippet;
      new_snippet.id = new_id;
      snippets.push(new_snippet);

      this.host.appData.snippets = get_snippets();

    });

  }

  hostDisconnected(): void {}
}
