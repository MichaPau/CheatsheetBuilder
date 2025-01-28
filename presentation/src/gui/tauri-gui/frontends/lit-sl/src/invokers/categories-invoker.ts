import { ReactiveController, ReactiveControllerHost } from "lit";

import { invoke } from "@tauri-apps/api/core";
import { Categories } from "../components/categories";
import { TreeNode } from "../components/tree";
import { Tag } from "../types";
import { ConfirmDialog } from "../components/confirm-dialog";

export class CategoriesInvoker implements ReactiveController {
  private host: Categories;

  constructor(host: ReactiveControllerHost & Categories) {
    this.host = host;
    this.host.addController(this);
  }

  async load_data() {
    const load_categories = await invoke("get_categories").catch(err => console.log(err)) as Array<Tag>;
    this.host.category_tree = this.buildTreeArray(load_categories);
  }
  hostConnected(): void {
    this.load_data();
    this.init_handlers();
  }

  hostDisconnected(): void {}

  init_handlers() {
    this.host.addEventListener('update-parent-category', this.onUpdateParentCategory);
    this.host.addEventListener('update_category_title', this.onUpdateCategoryTitle);
    this.host.addEventListener('add_category', this.onAddCategory);
    this.host.addEventListener('delete_category', this.onDeleteCategory);

  }

  onUpdateCategoryTitle = async (ev: CustomEvent) => {
    console.log("onUpdateCategoryTitle");
    let update_result = await invoke("update_tag_title", { tagId: ev.detail.tag_id, newTitle: ev.detail.new_title }).catch(err => console.log(err));
    if(update_result) {
      const load_categories = await invoke("get_categories").catch(err => console.log(err)) as Array<Tag>;
      this.host.category_tree = this.buildTreeArray(load_categories);
    }
  }
  onDeleteCategory = async(ev: CustomEvent) => {
    console.log("onDeleteCategory");
    let count_result = await invoke("get_snippet_count_for_tag", { tagId: ev.detail.tag_id }).catch(err => console.log(err));
    console.log("count_result:", count_result);

    const dlg = new ConfirmDialog();
    dlg.message = "Delete category " + ev.detail.title + " " + count_result + " snippets are using it.";
    this.host.shadowRoot?.appendChild(dlg);
    let answer = await dlg.confirm();

    if(answer) {
      console.log("delete for real");
      let delete_result = await invoke("delete_category", { tagId: ev.detail.tag_id }).catch(err => console.log(err));
      console.log("count_result:", delete_result);
      if(delete_result) {
        const load_categories = await invoke("get_categories").catch(err => console.log(err)) as Array<Tag>;
        this.host.category_tree = this.buildTreeArray(load_categories);
      }
    }

  }
  onAddCategory = async(ev: CustomEvent) => {
    console.log("onAddCategory: ", ev.detail);
    let create_tag_result = await invoke("create_category", { parentId: ev.detail.parent_id, title: ev.detail.title }).catch(err => console.log(err));
    if(create_tag_result) {
      const load_categories = await invoke("get_categories").catch(err => console.log(err)) as Array<Tag>;
      this.host.category_tree = this.buildTreeArray(load_categories);
    }
  }
  onUpdateParentCategory = async (ev: CustomEvent) => {
    console.log("updateParntCategory:",ev.detail);
    let update_result = await invoke("set_tag_parent_id", {tagId: ev.detail.tag_id, newParentId: ev.detail.new_parent_id}).catch(err => console.log(err));
    if (update_result) {
      const load_categories = await invoke("get_categories").catch(err => console.log(err)) as Array<Tag>;
      this.host.category_tree = this.buildTreeArray(load_categories);
    }

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
