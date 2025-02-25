
import { invoke } from "@tauri-apps/api/core";
import { Snippet, Tag, TextType } from "../types";
import { ConfirmDialog } from "../components/confirm-dialog";

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
  static async deleteSnippet(id: number): Promise<boolean> {

      return new Promise(async (resolve, reject) => {
        const dlg = new ConfirmDialog();
        dlg.message = "Delete snippet " + id + "?";
        document.body.appendChild(dlg);
        let answer = await dlg.confirm();

        if (answer) {
          await invoke("delete_snippet", { id: id }).then((_result) => {
            resolve(true);
          }).catch((err) => {
            reject(err);
          });
        } else {
          reject("delete canceled");
        }

      });

  }

  static async updateTextContent(id: number, new_content: string, text_type: TextType): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await invoke("update_snippet_text", { id: id, newText: new_content, textType: text_type }).then((_result) => {
        resolve(true);
      }).catch((err) => {
        console.log(err);
        reject(err);
      })
    });
  }

  static async createTag(title: string): Promise<Tag> {
    return new Promise(async (resolve, reject) => {
      await invoke("create_tag", { title })
        .then((result) => resolve(result as Tag))
        .catch((err) => reject(err));
    });
  }
  static async createTagAndAdd(snippet_id: number, title: string): Promise<Array<Tag>> {
    return new Promise(async (resolve, reject) => {
      await invoke("create_tag", { title })
        .then((result) => SnippetInvoker.addTag((result as Tag).id, snippet_id))
        .then((result) => resolve(result))
        .catch((err) => reject(err));
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
  static async createSnippet(snippet: Snippet): Promise<boolean> {

    console.log("SnippetInvoker::createSnippet");
    const tagIds = snippet.tags.map((tag) => tag.id);

    return new Promise(async (resolve, reject) => {
      await invoke("create_snippet", { title: snippet.title, text: snippet.text, textType: snippet.text_type, tagIds: tagIds })
        .then((_result) => {
          console.log("result: ", _result);
          resolve(true);
        })
        .catch((err) => reject("Error createSnippet: " + err));
    });

  }

}
