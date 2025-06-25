
import { invoke } from "../types";
import { Snippet, Tag, TextType } from "../types";
import { ConfirmDialog } from "../components/confirm-dialog";

export default class SnippetInvoker {

  static async addTag(tag_id: number, snippet_id: number, host: HTMLElement): Promise<Array<Tag>> {
    return new Promise(async (resolve, reject) => {
      const args = { snippetId: snippet_id, tagId: tag_id };
      await invoke("append_tag", args)
        .then((result) => {
          host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "addTag: success", cmd: "append_tag", args }, composed: true, bubbles: true}));
          resolve(result as Array<Tag>); 
        }).catch((err) => {
          host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "addTag: " + err, cmd: "append_tag", args }, composed: true, bubbles: true}));
          reject("SnippetInvoker::addTag no result");
        });
    });
  }

  static async searchTags(pattern: string, host: HTMLElement): Promise<Array<Tag>> {
    return new Promise(async (resolve, reject) => {
      await invoke("search_tags", { pattern: pattern, }).then((search_tag_result) => {
        resolve(search_tag_result as Array<Tag>);
        host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "searchTags: success", cmd: "search_tags", args: {pattern: pattern} }, composed: true, bubbles: true}));
      }).catch(err => {
        reject(err);
        host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "searchTags: " + err, cmd: "search_tags", args: { pattern: pattern } }, composed: true, bubbles: true}));
      }) 
    });
    
  }

  static async updateTitle(id: number, new_title: string, host: HTMLElement): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const args = { id: id, newTitle: new_title };
      await invoke("update_snippet_title", args ).then((_result)=> {
        resolve(true);
        host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "updateTitle: success", cmd: "update_snippet_title", args }, composed: true, bubbles: true}));
       }).catch(err => {
        host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "updateTitle: " + err, cmd: "update_snippet_title", args }, composed: true, bubbles: true}));
        reject(false);
      });

    });

  }
  static async deleteSnippet(id: number, host: HTMLElement): Promise<boolean> {

      return new Promise(async (resolve, reject) => {
        const dlg = new ConfirmDialog();
        dlg.message = "Delete snippet " + id + "?";
        document.body.appendChild(dlg);
        let answer = await dlg.confirm();

        if (answer) {
          await invoke("delete_snippet", { id: id }).then((_result) => {
            resolve(true);
            host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "deleteSnippet: success", cmd: "delete_snippet", args: { id: id } }, composed: true, bubbles: true}));
          }).catch((err) => {
            reject(err);
            host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "deleteSnippet: " + err, cmd: "delete_snippet", args: { id: id } }, composed: true, bubbles: true}));
          });
        } else {
          reject("delete canceled");
        }

      });

  }

  static async updateTextContent(id: number, new_content: string, text_type: TextType, host: HTMLElement): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const args = { id: id, newText: new_content, textType: text_type };
      await invoke("update_snippet_text", args).then((_result) => {
        resolve(true);
        host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "updateTextContent: success", cmd: "update_snippet_text", args }, composed: true, bubbles: true}));
      }).catch((err) => {
        reject(err);
        host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "updateTextContent: " + err, cmd: "update_snippet_text", args }, composed: true, bubbles: true}));
      })
    });
  }

  static async createTag(title: string, host: HTMLElement): Promise<Tag> {
    return new Promise(async (resolve, reject) => {
      await invoke("create_tag", { title })
        .then((result) => {
          resolve(result as Tag);        
          host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "createTag: success", cmd: "create_tag", args: { title } }, composed: true, bubbles: true}));
        })
        .catch((err) => {
          reject(err);        
          host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "createTag: " + err, cmd: "create_tag", args: { title } }, composed: true, bubbles: true}));
        });
    });
  }
  static async createTagAndAdd(snippet_id: number, title: string, host: HTMLElement): Promise<Array<Tag>> {
    return new Promise(async (resolve, reject) => {
      await invoke("create_tag", { title })
        .then((result) => SnippetInvoker.addTag((result as Tag).id, snippet_id, host))
        .then((result) => {
          resolve(result);
          host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "createTagAndAdd: success", cmd: "create_tag", args: { title } }, composed: true, bubbles: true}));
        })
        .catch((err) => {
          reject(err);
          host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "createTagAndAdd: " + err, cmd: "create_tag", args: { title } }, composed: true, bubbles: true}));
        });
    });
  }

  static async removeTag(snippet_id: number, tag_id: number, host: HTMLElement): Promise<Array<Tag>> {
    return new Promise(async (resolve, reject) => {
      const args = { snippetId: snippet_id, tagId: tag_id };
      await invoke("remove_tag_from_snippet", args).then((result) => {
        resolve(result as Array<Tag>);
        host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "removeTag: success", cmd: "remove_tag_from_snippet", args }, composed: true, bubbles: true}));
      }).catch((err) => {
        reject(err);
        host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "removeTag: " + err, cmd: "remove_tag_from_snippet", args }, composed: true, bubbles: true}));
      });
    });

  }

  static async createSnippet(snippet: Snippet, host: HTMLElement): Promise<boolean> {

    const tagIds = snippet.tags.map((tag) => tag.id);
    console.log("create snippet: ", snippet);
    return new Promise(async (resolve, reject) => {
      const args = { title: snippet.title, text: snippet.text, textType: snippet.text_type, tagIds: tagIds };
      await invoke("create_snippet", args)
        .then((_result) => {
          resolve(true);
          host.dispatchEvent(new CustomEvent('invoke-debug', {detail: {info: "createSnippet: success", cmd: "create_snippet", args }, composed: true, bubbles: true}));
        })
        .catch((err) => {
          reject(err);
          host.dispatchEvent(new CustomEvent('invoke-error', {detail: {info: "createSnippet: " + err, cmd: "create_snippet", args }, composed: true, bubbles: true}));
        });
    });

  }

}
