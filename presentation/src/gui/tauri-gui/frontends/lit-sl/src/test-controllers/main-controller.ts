import { ReactiveController, ReactiveControllerHost } from "lit";

import { App } from "../main.js";
import { buildTreeArray } from '../utils/utils.js';

import { Tag } from "../types";
import { ConfirmDialog } from "../components/confirm-dialog.js";


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
      { id: 11, title: "Sub1", tag_type: "Category", parent_id: 1, tag_style: null },
      { id: 12, title: "Sub2", tag_type: "Category", parent_id: 1, tag_style: null },
      { id: 13, title: "Sub3", tag_type: "Category", parent_id: 1, tag_style: null },
      { id: 111, title: "Sub1.1", tag_type: "Category", parent_id: 11, tag_style: null },
      { id: 112, title: "Sub1.2", tag_type: "Category", parent_id: 11, tag_style: null },
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
    this.host.addEventListener('update_category_title', this.onUpdateCategoryTitle);
    this.host.addEventListener('add_category', this.onAddCategory);
    this.host.addEventListener('delete_category', this.onDeleteCategory);
  }

  onUpdateParentCategory = async (_ev: CustomEvent) => {
    console.log("onUpdatePaentCategory");
  }
  onUpdateCategoryTitle = async (ev: CustomEvent) => {
    console.log("onUpdateCategoryTitle");
  }
  onDeleteCategory = async(ev: CustomEvent) => {
    console.log("onDeleteCategory in test-controller");
    const dlg = new ConfirmDialog();
    dlg.message = "confirm this message";
    this.host.shadowRoot?.appendChild(dlg);
    let answer = await dlg.confirm();
    console.log("the answer was: ", answer);
  }
  onAddCategory = async(ev: CustomEvent) => {
    console.log("onAddCategory");
  }
  hostConnected(): void {}

  hostDisconnected(): void {}
}
