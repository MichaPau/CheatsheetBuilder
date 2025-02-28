import { ReactiveController, ReactiveControllerHost } from "lit";

import { invoke } from "@tauri-apps/api/core";

import { SnippetTagList } from "../components/snippet/snippet-tag-list";
import { Tag } from "../types";

export default class TagListInvoker {
  static async getParentTags(tag_id: number): Promise<Array<Tag>> {
    return new Promise(async (resolve, reject) => {
      await invoke("get_parent_tags", { tagId: tag_id}).then((result) => {
        resolve(result as Array<Tag>);
      }).catch(err => {
        reject(err);
      })
    });
  }

  static async getTags(id_list: Array<number>): Promise<Array<Tag>> {
    return new Promise(async (resolve, reject) => {
      await invoke("get_tags", { tagIdFilter: id_list }).then((result) => {
        resolve(result as Array<Tag>);
      }).catch(err => {
        reject(err);
      })
    });
  }
}
export class TagListInvoker2 implements ReactiveController {
  private host: SnippetTagList;

  constructor(host: ReactiveControllerHost & SnippetTagList) {
    this.host = host;
    this.host.addController(this);
  }


  async getParentTags(tag_id: number) {
    let parent_tags_result = await invoke("get_parent_tags", {tagId: tag_id, }).catch(err => console.log(err));
    return parent_tags_result as Array<Tag>;
  }
  hostConnected(): void {}

  hostDisconnected(): void {}

}
