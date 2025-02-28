import { ReactiveController, ReactiveControllerHost } from "lit";

import { TreeNode } from "../../components/tree";
import { Tag } from "../../types";
import { ConfirmDialog } from "../../components/confirm-dialog";

import { snippets, tags, get_categories, get_snippets } from "./mockData";
import { App } from "../../main";

export default class CategoriesInvoker implements ReactiveController {
  private host: App;

  //private categories: Array<Tag>;
  constructor(host: ReactiveControllerHost & App) {
    this.host = host;
    this.host.addController(this);
    //this.categories = get_categories();
  }

  async load_categories() {
    const load_categories = get_categories();
    return this.buildTreeArray(load_categories);
  }
  async reload_categories() {
    const load_categories = get_categories();
    this.host.appData = { ... this.host.appData, categories:  this.buildTreeArray(load_categories)};
  }
  hostConnected(): void {

    this.init_handlers();
  }

  hostDisconnected(): void {}

  init_handlers() {
    this.host.addEventListener('update-parent-category', this.onUpdateParentCategory);
    this.host.addEventListener('update-category-title', this.onUpdateCategoryTitle);
    this.host.addEventListener('add-category', this.onAddCategory);
    this.host.addEventListener('delete_category', this.onDeleteCategory);

  }

  // set_categories() {
  //   this.categories = get_categories();
  //   this.host.appData.categories = this.buildTreeArray(this.categories);
  // }
  onUpdateCategoryTitle = async (ev: CustomEvent) => {

    let found = tags.find(item => item.id === ev.detail.tag_id);
    if (found) {
      found.title = ev.detail.new_title;
    }
    this.host.main_controller.load_data();

  }
  onDeleteCategory = async(ev: CustomEvent) => {
    console.log("onDeleteCategory");
    let f = snippets.filter((snippet) => snippet.tags.findIndex((tag) => tag.id === ev.detail.tag_id) !== -1);


    const dlg = new ConfirmDialog();
    dlg.message = "Delete category " + ev.detail.title + " " + f.length + " snippets are using it.";
    this.host.shadowRoot?.appendChild(dlg);
    let answer = await dlg.confirm();

    if(answer) {
      console.log("delete for real");
      f.forEach((snippet) => {
        let index = snippet.tags.findIndex(tag => tag.id === ev.detail.tag_id);
        snippet.tags.splice(index, 1);
      });

      let index = tags.findIndex(tag => tag.id === ev.detail.tag_id);
      tags.splice(index, 1);

      this.reload_categories();

    }

  }
  onAddCategory = async(ev: CustomEvent) => {
    console.log("onAddCategory: ", ev.detail);
    let new_id = Math.max(...get_categories().map(tag => tag.id)) + 1;
    tags.push({ id: new_id, title: ev.detail.title, tag_type: "Category", parent_id: ev.detail.parent_id, tag_style: null });
    this.reload_categories();

  }
  onUpdateParentCategory = async (ev: CustomEvent) => {
    console.log("updateParntCategory:",ev.detail);
    let tag = tags.find((tag) => tag.id === ev.detail.tag_id);
    if (tag) {
      tag.parent_id = ev.detail.new_parent_id;
    }
    this.reload_categories();

  }

  buildTreeArray(flatArray: Array<Tag>): Array<TreeNode> {
      // Store references to nodes by their IDs
      const nodeMap = new Map();

      // Store the root nodes of the tree
      const result = [] as Array<TreeNode>;

      // Create a reference object
      flatArray.forEach((item) => {
          nodeMap.set(item.id, {
              item: item,
              selected: false,
              open: false,
              children: [] as Array<TreeNode>,
          } as TreeNode);
          //nodeMap[item.id] = { ...item, children: [] };
      });

      // Build the tree array
    flatArray.forEach((item) => {
      //const node = nodeMap[item.id];
      const node = nodeMap.get(item.id) as TreeNode;
      node.selected = this.host.appSettings.selected_categories.includes(item.id);
      node.open = this.host.appSettings.open_categories.includes(item.id);
      if (item.parent_id !== null) {
        const p_node = nodeMap.get(item.parent_id) as TreeNode;
          p_node.children.push(node);
        // if (!p_node.open) p_node.open = true;
          //nodeMap[item.parentId].children.push(node);
      } else {
          result.push(node);
      }

    });

    return result;
  }

}
