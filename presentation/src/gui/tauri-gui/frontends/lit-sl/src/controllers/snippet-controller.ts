import { ReactiveController, ReactiveControllerHost } from "lit";
import { SnippetContainer } from "../components/snippet";

import { invoke } from "@tauri-apps/api/core";
import { Tag } from "../types";

export class SnippetController implements ReactiveController {
  private host: SnippetContainer;

  constructor(host: ReactiveControllerHost & SnippetContainer) {
    this.host = host;
    this.host.addController(this);
  }

  async addTag(tag_id: number) {
    let result: Array<Tag> = await invoke("append_tag", { snippetId: this.host.snippet.id, tagId: tag_id }) as Array<Tag>;
    if (result) {
      this.host.tagResult(result, true);
    }
  }
  async searchTags(pattern: string) {
    let search_tags_result: Array<Tag> = await invoke("search_tags", { pattern: pattern, }).catch(err => {
      console.log(err);
      return [];
    }) as Array<Tag>;
    return search_tags_result;
  }

  async updateTitle(id: number, new_title: string) {
    let update_result = await invoke("update_snippet_title", { id: id, newTitle: new_title }).catch(err => {
      console.log(err);
      return false;
    });
    return update_result;
  }

  async removeTag(snippet_id: number, tag_id: number) {
    let result: Array<Tag> = await invoke("remove_tag_from_snippet", { snippetId: snippet_id, tagId: tag_id }) as Array<Tag>;
    if (result) {
      this.host.tagResult(result, false);
    }

  }
  hostConnected(): void {}

  hostDisconnected(): void {}

}
