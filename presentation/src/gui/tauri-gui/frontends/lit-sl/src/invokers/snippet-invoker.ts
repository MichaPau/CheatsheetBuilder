
import { invoke } from "@tauri-apps/api/core";
import { Tag } from "../types";

export default class SnippetInvoker {

  static async addTag(tag_id: number, snippet_id: number): Promise<Array<Tag>> {
    return new Promise(async (resolve, reject) => {
      let result: Array<Tag> = await invoke("append_tag", { snippetId: snippet_id, tagId: tag_id }) as Array<Tag>;
      if (result) {
        resolve(result);
      } else {
        reject("SnippetInvoker::addTag no result");
      }
    });

  }
  static async searchTags(pattern: string): Promise<Array<Tag>> {
    let search_tags_result: Array<Tag> = await invoke("search_tags", { pattern: pattern, }).catch(err => {
      console.log(err);
      return [];
    }) as Array<Tag>;
    return search_tags_result;
  }

  static async updateTitle(id: number, new_title: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await invoke("update_snippet_title", { id: id, newTitle: new_title }).then((_result)=> {
        resolve(true);
      }).catch(err => {
        console.log(err);
        reject(false);
      });

    });

  }

  static async removeTag(snippet_id: number, tag_id: number): Promise<Array<Tag>> {
    return new Promise(async (resolve, reject) => {
      let result: Array<Tag> = await invoke("remove_tag_from_snippet", { snippetId: snippet_id, tagId: tag_id }) as Array<Tag>;
      if (result) {
        resolve(result);
      } else {
        reject("SnippetInvoker::removeTag error");
      }
    });


  }


}
