import { ReactiveController, ReactiveControllerHost } from "lit";

import { App } from "../../main.js";

import { snippets, get_snippets, snippet_tags } from "./mockData.js";


import { CategoriesInvoker, Snippet } from '../../types.js';

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
    //this.host.addEventListener('create-snippet', this.createSnippet);
    this.host.addEventListener('set-selected-categories', this.setSelectedCategories);
    this.host.addEventListener('reload-snippets', this.reloadSnippets);

  }
  hostDisconnected(): void {}

  setSelectedCategories = (ev: CustomEvent) => {
    let ids = (ev as CustomEvent).detail;
    console.log("main::setting ids: ",ids);
    this.host.appSettings = {...this.host.appSettings, selected_categories: ids};
  }

  reloadSnippets = (_ev: Event) =>  {
    console.log("reload Snippets");
    let s = get_snippets();
    console.log(s);
    this.host.appData = { ...this.host.appData, snippets: get_snippets() };
  }
  // createSnippet = (ev: CustomEvent<{snippet: Snippet}>) => {

  //   console.log("mock invoker::createSnippet:", ev.composedPath());
  //   console.log("mock invoker::createSnippet:", ev.currentTarget);
  //   let new_id = Math.max(...snippets.map(s => s.id)) + 1;
  //   let new_snippet = ev.detail.snippet;
  //   for (const tag of new_snippet.tags) {
  //     snippet_tags.push({ snippet_id: new_id, tag_id: tag.id });
  //   }
  //   new_snippet.tags = [];
  //   new_snippet.id = new_id;
  //   snippets.push(new_snippet);

  //   this.host.appData = { ...this.host.appData, snippets: get_snippets() };
  // }
}
