import { ReactiveController, ReactiveControllerHost } from "lit";

import { App } from "../main.js";

import { categories, tags } from "../invokers/mock-invokers/mockData.js";

export default class MainController implements ReactiveController {
  private host: App;

  constructor(host: ReactiveControllerHost & App) {
    this.host = host;
    this.host.addController(this);
  }

  async load_data() {

    this.host.snippets = [
      {id: 1, title: "one", text: "snippet_one", created_at: 0, updated_at: 0, tags: [categories[4], tags[0]], text_type: "markdown"},
      {id: 2, title: "two", text: "snippet_two", created_at: 0, updated_at: 0, tags: [], text_type: "markdown"},
    ];
  }

  init_handlers() {
    // this.host.addEventListener('update-parent-category', this.onUpdateParentCategory);
    // this.host.addEventListener('update_category_title', this.onUpdateCategoryTitle);
    // this.host.addEventListener('add_category', this.onAddCategory);
    // this.host.addEventListener('delete_category', this.onDeleteCategory);
  }


  hostConnected(): void {}

  hostDisconnected(): void {}
}
