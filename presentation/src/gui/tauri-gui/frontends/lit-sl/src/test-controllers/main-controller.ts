import { ReactiveController, ReactiveControllerHost } from "lit";

import { App } from "../main.js";
import { buildTreeArray } from '../utils/utils.js';

import { Snippet, Tag } from "../types";


export class MainController implements ReactiveController {
  private host: App;

  //private db = new Database("../../../../../../../../data/dev_db.db");

  constructor(host: ReactiveControllerHost & App) {
    this.host = host;
    this.host.addController(this);
  }

  async load_data() {
    //const cats = this.db.query("select * from Tag where tag_type = 1");

    const load_categories: Array<Tag> = [
      { id: 1, title: "First", tag_type: "Category", parent_id: null, tag_style: null },
      { id: 3, title: "Sub1", tag_type: "Category", parent_id: 1, tag_style: null },
      { id: 5, title: "Sub1.2", tag_type: "Category", parent_id: 3, tag_style: null },
      { id: 4, title: "Second", tag_type: "Category", parent_id: null, tag_style: null },
      { id: 6, title: "Third", tag_type: "Category", parent_id: null, tag_style: null }

    ];
    let normal: Tag = { id: 2, title: "Something", tag_type: "Normal", parent_id: null, tag_style: null };
    this.host.categories = buildTreeArray(load_categories);

    //const snippets = this.db.query("select * from Snippet");
    this.host.snippets = [
      {id: 1, title: "one", text: "snippet_one", created_at: 0, updated_at: 0, tags: [load_categories[3], normal], text_type: "markdown"},
      {id: 2, title: "two", text: "snippet_two", created_at: 0, updated_at: 0, tags: [], text_type: "markdown"},
    ];
  }

  init_handlers() {
    this.host.addEventListener('update-parent-category', this.onUpdateParentCategory);
  }

  onUpdateParentCategory = async (ev: CustomEvent) => {

    // let update_result = await invoke("set_tag_parent_id", {tagId: ev.detail.tag_id, newParentId: ev.detail.new_parent_id}).catch(err => console.log(err));
    // if (update_result) {
    //   const load_categories = await invoke("get_categories").catch(err => console.log(err)) as Array<Tag>;
    //   this.host.categories = buildTreeArray(load_categories);
    // }

  }
  hostConnected(): void {}

  hostDisconnected(): void {}
}
