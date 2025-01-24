import { ReactiveController, ReactiveControllerHost } from "lit";

import { App } from "../main.js";
//import { buildTreeArray } from '../utils/utils.js';
import { invoke } from "@tauri-apps/api/core";
import { Snippet, Tag } from "../types";
import { TreeNode } from "../components/tree.js";

export class MainController implements ReactiveController {
  private host: App;

  constructor(host: ReactiveControllerHost & App) {
    this.host = host;
    this.host.addController(this);
  }

  async load_data() {
    const load_categories = await invoke("get_categories").catch(err => console.log(err)) as Array<Tag>;
    this.host.categories = this.buildTreeArray(load_categories);
    this.host.snippets = await invoke("get_snippets").catch(err => console.log(err)) as Array<Snippet>;
  }

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
      this.host.categories = this.buildTreeArray(load_categories);
    }
  }
  onDeleteCategory = async(ev: CustomEvent) => {
    console.log("onDeleteCategory");
    let count_result = await invoke("get_snippet_count_for_tag", { tagId: ev.detail.tag_id }).catch(err => console.log(err));
    if(count_result) {
      //Show confirm
    }
  }
  onAddCategory = async(ev: CustomEvent) => {
    console.log("onAddCategory");
    let create_tag_result = await invoke("create_category", { parentId: ev.detail.parent_id, title: ev.detail.title }).catch(err => console.log(err));
    if(create_tag_result) {
      const load_categories = await invoke("get_categories").catch(err => console.log(err)) as Array<Tag>;
      this.host.categories = this.buildTreeArray(load_categories);
    }
  }
  onUpdateParentCategory = async (ev: CustomEvent) => {
    console.log("updateParntCategory:",ev.detail);
    let update_result = await invoke("set_tag_parent_id", {tagId: ev.detail.tag_id, newParentId: ev.detail.new_parent_id}).catch(err => console.log(err));
    if (update_result) {
      const load_categories = await invoke("get_categories").catch(err => console.log(err)) as Array<Tag>;
      this.host.categories = this.buildTreeArray(load_categories);
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
  hostConnected(): void {}

  hostDisconnected(): void {}
}
