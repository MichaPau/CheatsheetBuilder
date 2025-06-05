import { ReactiveController, ReactiveControllerHost } from "lit";

import { invoke } from "../types";
// import { invoke } from "../invokers/mock-invokers/mockData";

import { TreeNode } from "../components/tree";
import { Tag } from "../types";
import { ConfirmDialog } from "../components/confirm-dialog";
import { App } from "../main";

export default class CategoriesInvoker implements ReactiveController {
  private host: App;

  constructor(host: ReactiveControllerHost & App) {
    this.host = host;
    this.host.addController(this);
  }

  async load_categories() {
    await invoke("get_categories").then((result) => {
      const categories = result as Array<Tag>;
      this.host.appDataCategories = { ... this.host.appDataCategories, categories:  this.buildTreeArray(categories)};
      this.host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "load_categories: success", cmd: "get_categories", args: {}, meta_url: import.meta.url }}));
    }).catch((err) => {
       this.host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "load_categories: " + err, cmd: "get_categories", args: {}, meta_url: import.meta.url }}));
    });
  }
  async reload_categories() {
    await invoke("get_categories").then((result) => {
      const categories = result as Array<Tag>;
      this.host.appDataCategories = { ... this.host.appDataCategories, categories:  this.buildTreeArray(categories)};
      this.host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "reload_categories: success", cmd: "get_categories", args: {}, meta_url: import.meta.url }}));
    }).catch((err) => {
       this.host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "reload_categories: " + err, cmd: "get_categories", args: {}, meta_url: import.meta.url }}));
    });
  }
  hostConnected(): void {
    this.init_handlers();
  }

  hostDisconnected(): void {
    this.host.removeEventListener('update-parent-category', this.onUpdateParentCategory);
    this.host.removeEventListener('update-category-title', this.onUpdateCategoryTitle);
    this.host.removeEventListener('add-category', this.onAddCategory);
    this.host.removeEventListener('delete_category', this.onDeleteCategory);
  }

  init_handlers() {
    this.host.addEventListener('update-parent-category', this.onUpdateParentCategory);
    this.host.addEventListener('update-category-title', this.onUpdateCategoryTitle);
    this.host.addEventListener('add-category', this.onAddCategory);
    this.host.addEventListener('delete_category', this.onDeleteCategory);

  }

  onUpdateCategoryTitle = async (ev: CustomEvent) => {
    const args = { tagId: ev.detail.tag_id, newTitle: ev.detail.new_title };

    await invoke("update_tag_title", args).then((_) => {
      this.host.main_controller.load_data();
      this.host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "onUpdateCategoryTitle: success", cmd: "update_tag_title", args: args, meta_url: import.meta.url }}));
      
    }).catch((err) => {   
      this.host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "onUpdateCategoryTitle: " + err, cmd: "update_tag_title", args: args, meta_url: import.meta.url }}));
    });
  }
  onDeleteCategory = async(ev: CustomEvent) => {
     await invoke("get_snippet_count_for_tag", { tagId: ev.detail.tag_id }).then(async (count_result) => {
       
        const dlg = new ConfirmDialog();
        dlg.message = "Delete category " + ev.detail.title + " " + count_result + " snippets are using it.";
        this.host.shadowRoot?.appendChild(dlg);
        let answer = await dlg.confirm();

        if(answer) {
          await invoke("delete_category", { tagId: ev.detail.tag_id }).then((_) => {
            this.host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "onDeleteCategory: success", cmd: "delete_category", args: { tagId: ev.detail.tag_id }, meta_url: import.meta.url }}));
            this.reload_categories();
          }).catch((err) => {
            this.host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "onDeleteCategory: " + err, cmd: "delete_category", args: { tagId: ev.detail.tag_id }, meta_url: import.meta.url }}));
          });
        }
     }).catch((err) => {
      this.host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "onDeleteCategory: " + err, cmd: "get_snippet_count_for_tag", args: { tagId: ev.detail.tag_id }, meta_url: import.meta.url }}));
     });


  }
  onAddCategory = async(ev: CustomEvent) => {
    const parent_id = ev.detail.parent_id !== 0 ? ev.detail.parent_id : null;
    const args = { parentId: parent_id, title: ev.detail.title };
      await invoke("create_category", args).then((_) => {
        this.host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "onAddCategory: success", cmd: "create_category", args: args, meta_url: import.meta.url }}));
        this.reload_categories();
      }).catch((err) => {
        this.host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "onAddCategory: " + err, cmd: "create_category", args: args, meta_url: import.meta.url }}));
        
      });
  }
  onUpdateParentCategory = async (ev: CustomEvent) => {
    const args = {tagId: ev.detail.tag_id, newParentId: ev.detail.new_parent_id};
    await invoke("set_tag_parent_id", args).then((_) => {
      this.reload_categories();
      this.host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "onUpdateParentCategory: success", cmd: "set_tag_parent_id", args: args, meta_url: import.meta.url }}));
    }).catch((err) => {
      this.host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "onUpdateParentCategory: " + err, cmd: "set_tag_parent_id", args: args, meta_url: import.meta.url }}));
    });
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
