import { ReactiveController, ReactiveControllerHost } from "lit";

import { invoke } from "@tauri-apps/api/core";

import { SnippetTagList } from "../components/snippet-tag-list";

export class TagListInvoker implements ReactiveController {
  private host: SnippetTagList;

  constructor(host: ReactiveControllerHost & SnippetTagList) {
    this.host = host;
    this.host.addController(this);
  }


  async getParentTags(tag_id: number) {
    let parent_tags_result = await invoke("get_parent_tags", {tagId: tag_id, }).catch(err => console.log(err));
    return parent_tags_result;
  }
  hostConnected(): void {}

  hostDisconnected(): void {}

}
