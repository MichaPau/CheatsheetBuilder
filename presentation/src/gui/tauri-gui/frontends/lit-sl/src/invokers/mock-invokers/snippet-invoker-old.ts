import { ReactiveController, ReactiveControllerHost } from "lit";
import { SnippetContainer } from "../../components/snippet/snippet";

import { Tag } from "../../types";
import { snippets, tags } from "./mockData";


export default class SnippetInvoker implements ReactiveController {
  private host: SnippetContainer;

  constructor(host: ReactiveControllerHost & SnippetContainer) {
    this.host = host;
    this.host.addController(this);
  }


  async addTag(tag_id: number) {
    let snippet = snippets.find(item => item.id === this.host.snippet.id);
    let tag = tags.find(item => item.id === tag_id);

    if (snippet && tag) {
      snippet.tags.push(tag);
      let result = [...snippet.tags];
      this.host.tagResult(result);
    }

  }
  async searchTags(pattern: string) {

    let search_tags_result: Array<Tag> = tags.filter((tag) => tag.title.toLowerCase().includes(pattern.toLowerCase()));
    console.log("mock search:", search_tags_result);
    return search_tags_result;
  }

  async updateTitle(id: number, new_title: string) {
    let snippet = snippets.find(item => item.id === id);
    if(snippet) {
      snippet.title = new_title;
      return true;
    } else {
      return false;
    }

  }

  async removeTag(snippet_id: number, tag_id: number) {
    let snippet = snippets.find(item => item.id === snippet_id);
    if (snippet) {
      let index = snippet.tags.findIndex(tag => tag.id === tag_id);
      snippet.tags.splice(index, 1);
      console.log("remove mock:", snippet.tags);
      const new_tags = [...snippet.tags];
      this.host.tagResult(new_tags, false);
    }

  }
  hostConnected(): void {}

  hostDisconnected(): void {}

}
