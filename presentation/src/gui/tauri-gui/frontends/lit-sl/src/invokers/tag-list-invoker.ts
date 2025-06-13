// import { ReactiveController, ReactiveControllerHost } from "lit";

import { invoke } from "../types";

// import { SnippetTagList } from "../components/snippet/snippet-tag-list";
import { Tag } from "../types";

export default class TagListInvoker {
  static async getParentTags(tag_id: number, host: HTMLElement): Promise<Array<Tag>> {
    return new Promise(async (resolve, reject) => {
      await invoke("get_parent_tags", { tagId: tag_id}).then((result) => {
        host.dispatchEvent(new CustomEvent("invoke-debug", {detail: {info: "getParentTags: success", cmd: "get_parent_tags", args: {tagId: tag_id}, }, composed: true, bubbles: true}));
        resolve(result);
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
}
