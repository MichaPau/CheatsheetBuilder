

import { Snippet, Tag } from "../../types";
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
