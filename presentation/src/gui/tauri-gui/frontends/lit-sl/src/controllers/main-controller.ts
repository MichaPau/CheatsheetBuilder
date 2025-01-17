import { ReactiveController, ReactiveControllerHost } from "lit";

import { App } from "../main.js";
import { buildTreeArray } from '../utils/utils.js';
import { invoke } from "@tauri-apps/api/core";
import { Snippet, Tag } from "../types";

export class MainController implements ReactiveController {
  private host: App;

  constructor(host: ReactiveControllerHost & App) {
    this.host = host;
    this.host.addController(this);
  }

  async load_data() {
    const load_categories = await invoke("get_categories").catch(err => console.log(err)) as Array<Tag>;
    this.host.categories = buildTreeArray(load_categories);
    this.host.snippets = await invoke("get_snippets").catch(err => console.log(err)) as Array<Snippet>;
  }

  init_handlers() {
    this.host.addEventListener('update-parent-category', this.onUpdateParentCategory);
  }

  onUpdateParentCategory = async (ev: CustomEvent) => {

    let update_result = await invoke("set_tag_parent_id", {tagId: ev.detail.tag_id, newParentId: ev.detail.new_parent_id}).catch(err => console.log(err));
    if (update_result) {
      const load_categories = await invoke("get_categories").catch(err => console.log(err)) as Array<Tag>;
      this.host.categories = buildTreeArray(load_categories);
    }

  }
  hostConnected(): void {}

  hostDisconnected(): void {}
}
