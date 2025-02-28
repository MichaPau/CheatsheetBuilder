

import { ConfirmDialog } from "../../components/confirm-dialog";
import { Snippet, Tag, TextType } from "../../types";
import { snippet_tags, snippets, tags } from "./mockData";


export default class SnippetInvoker  {

  static async addTag(tag_id: number, snippet_id: number): Promise<Array<Tag>> {
    return new Promise((resolve, reject) => {
      let snippet = snippets.find(item => item.id === snippet_id);
      let tag = tags.find(item => item.id === tag_id);

      if (snippet && tag) {
        snippet.tags.push(tag);
        let result = [...snippet.tags];
        resolve(result);
      } else {
        reject("addTag::Snippet or Tag nor found");
      }
    });

  }
  static async createTag(title: string): Promise<Tag> {
    let new_id = Math.max(...tags.map(t => t.id)) + 1;
    const tag: Tag = { id: new_id, title, parent_id: null, tag_style: null, tag_type: "Normal"};
    return new Promise((resolve, _reject) => {
      tags.push(tag);
      resolve(tag);
    });
  }
  static async createTagAndAdd(snippet_id: number, title: string): Promise<Array<Tag>> {
    return new Promise(async (resolve, reject) => {
      await this.createTag(title)
        .then((result) => this.addTag((result as Tag).id, snippet_id))
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  }
  static async searchTags(pattern: string): Promise<Array<Tag>> {

    let search_tags_result: Array<Tag> = tags.filter((tag) => tag.title.toLowerCase().includes(pattern.toLowerCase()));
    console.log("mock search:", search_tags_result);
    return search_tags_result;
  }

  static async updateTitle(id: number, new_title: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let snippet = snippets.find(item => item.id === id);
      if(snippet) {
        snippet.title = new_title;
        resolve(true);
      } else {
        reject("updateTitle::Snippet not found");
      }

    });
  }

  static async updateTextContent(id: number, new_content: string, text_type: TextType): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let snippet = snippets.find(item => item.id === id);
      if(snippet) {
        snippet.text = new_content;
        snippet.text_type = text_type;

        resolve(true);
      } else {
        reject("updateTextContent::Snippet not found");
      }

    });
  }

  static async deleteSnippet(id: number): Promise<boolean> {


    return new Promise( async (resolve, reject) => {
      let index = snippets.findIndex(item => item.id === id);

        const dlg = new ConfirmDialog();
        dlg.message = "Delete snippet " + id + "?";
        document.body.appendChild(dlg);
        let answer = await dlg.confirm();

          if (answer) {
            const removed = snippets.splice(index, 1);
            if(removed.length === 1) {
              resolve(true);
            } else {
              reject("Snippet to remove not found");
            }
          } else {
            reject("delete snippet canceled");
          }
    });
  }

  static async removeTag(snippet_id: number, tag_id: number): Promise<Array<Tag>> {

    return new Promise((resolve, reject) => {
      let snippet = snippets.find(item => item.id === snippet_id);
      if (snippet) {
        let index = snippet.tags.findIndex(tag => tag.id === tag_id);
        snippet.tags.splice(index, 1);
        console.log("remove mock:", snippet.tags);
        const new_tags = [...snippet.tags];
        resolve(new_tags);
      } else {
        reject("removeTag::Snippet not found");
      }
    });
  }
  static async createSnippet(snippet: Snippet): Promise<boolean> {

    let new_id = Math.max(...snippets.map(s => s.id)) + 1;
    let new_snippet = snippet;
    for (const tag of new_snippet.tags) {
      snippet_tags.push({ snippet_id: new_id, tag_id: tag.id });
    }
    new_snippet.tags = [];
    new_snippet.id = new_id;
    snippets.push(new_snippet);

    return new Promise((resolve, _) => {
      resolve(true);
    });

  }

}
