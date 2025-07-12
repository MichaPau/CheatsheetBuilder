// import { ReactiveController, ReactiveControllerHost } from "lit";

import { invoke } from "../types";

// import { SnippetTagList } from "../components/snippet/snippet-tag-list";
import { Tag, TagWithCount } from "../types";

export default class TagListInvoker {
  static async getParentTags(tag_id: number, host: HTMLElement): Promise<Array<Tag>> {
    return new Promise(async (resolve, reject) => {
      await invoke("get_parent_tags", { tagId: tag_id}).then((result) => {
        host.dispatchEvent(new CustomEvent("invoke-debug", {detail: {info: "getParentTags: success", cmd: "get_parent_tags", args: {tagId: tag_id}, }, composed: true, bubbles: true}));
        resolve(result as Array<Tag>);
      }).catch(err => {
         host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "getParentTags: " + err, cmd: "get_parent_tags", args: {tagId: tag_id} }, composed: true, bubbles: true}));
          reject(err);
      })
    });
  }

  static async getTags(id_list: Array<number>, host: HTMLElement): Promise<Array<Tag>> {
    return new Promise(async (resolve, reject) => {
      await invoke("get_tags", { tagIdFilter: id_list }).then((result) => {
        host.dispatchEvent(new CustomEvent("invoke-debug", {detail: {info: "getTags: success", cmd: "get_tags", args: {tagIdFilter: id_list}}, composed: true, bubbles: true}));
        resolve(result as Array<Tag>);
      }).catch(err => {
         host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "getTags: " + err, cmd: "getTags", args: {tagId: id_list} }, composed: true, bubbles: true}));
        reject(err);
      })
    });
  }
  static async getTagsFull(host: HTMLElement): Promise<Array<TagWithCount>> {
    return new Promise(async (resolve, reject) => {
      await invoke("get_tag_list_full").then((result) => {
        host.dispatchEvent(new CustomEvent("invoke-debug", {detail: {info: "get_tag_list_full: success", cmd: "get_tag_list_full", args: {}}, composed: true, bubbles: true}));
        resolve(result as Array<TagWithCount>);
      }).catch(err => {
         host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "get_tag_list_full: " + err, cmd: "get_tag_list_full", args: {} }, composed: true, bubbles: true}));
        reject(err);
      })
    });
  }
  static async updateTagTitle(tag_id: number, newTitle: string, host: HTMLElement): Promise<boolean> {
    const args = { tagId: tag_id, newTitle: newTitle };
    return new Promise(async (resolve, reject) => {
      await invoke("update_tag_title", args)
        .then((result) => {
          host.dispatchEvent(new CustomEvent("invoke-debug", { detail: { info: "update_tag_title: success", cmd: "update_tag_title", args: args }, composed: true, bubbles: true }));
          resolve(result as boolean);
        })
        .catch((err) => {
          host.dispatchEvent(new CustomEvent("invoke-error", { detail: { info: "update_tag_title: " + err, cmd: "update_tag_title", args: args }, composed: true, bubbles: true }));
          reject(err);
        })
    });
  }
  static async deleteTagConfirmed(tag_id: number, host: HTMLElement): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await invoke("delete_tag", {tagId: tag_id})
        .then((_) => {
  
            host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "deleteTagConfirmed: success", cmd: "delete_tag", args: { tagId: tag_id } }, composed: true, bubbles: true}));
            resolve(true);
        })
        .catch((err) => {
            host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "deleteTagConfirmed: " + err, cmd: "delete_tag", args: { tagId: tag_id } }, composed: true, bubbles: true}));
            reject(false);
        });
    });
  }
  static async updateParentTag (tag_id: number, new_parent_id: number | null, new_type: string | null = null,  host: HTMLElement) {

    let args;
    if(new_type) {
      args = {tagId: tag_id, newParentId: new_parent_id, newType: new_type};
    } else {
      args = {tagId: tag_id, newParentId: new_parent_id};
    }
    return new Promise(async (resolve, reject) => {
      
      await invoke("set_tag_parent_id", args).then((_) => {
        host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "updateParentTag: success", cmd: "set_tag_parent_id", args: args }, composed: true, bubbles: true}));
        resolve(true);
        host.dispatchEvent(new Event('reload-categories', {bubbles: true, composed: true}));
      }).catch((err) => {
        host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "updateParentTag: " + err, cmd: "set_tag_parent_id", args: args }, composed: true, bubbles: true}));
        reject(false);
      });
    });
  }

}
