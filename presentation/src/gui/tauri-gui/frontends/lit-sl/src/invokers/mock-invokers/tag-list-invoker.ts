import { ReactiveController, ReactiveControllerHost } from "lit";

import { SnippetTagList } from "../../components/snippet/snippet-tag-list";
import { Tag } from "../../types";

import { tags } from "./mockData";

export default class TagListInvoker {
  static async getParentTags(tag_id: number): Promise<Array<Tag>> {
    const item = tags.find(item => item.id === tag_id) as Tag;
    let parent_id = item?.parent_id;

    let parent_tags_result: Array<Tag> = [item];

    let count = 0;
    while ( parent_id && count < 10) {
      //console.log(parent_id);
      const parent_tag = tags.find(item => item.id === parent_id)!
      parent_tags_result.push(parent_tag);
      parent_id = parent_tag.parent_id;
      count++;
    }
    return Promise.resolve(parent_tags_result);
  }

  static async getTags(id_list: Array<number>): Promise<Array<Tag>> {
    return new Promise(async (resolve, _reject) => {
      const tag_list = tags.filter((tag) => id_list.indexOf(tag.id) !== -1);
      resolve(tag_list);
    });
  }
}

export class TagListInvoker2 implements ReactiveController {
  private host: SnippetTagList;

  constructor(host: ReactiveControllerHost & SnippetTagList) {
    this.host = host;
    this.host.addController(this);
  }


 getParentTags = async (tag_id: number) => {

    const item = tags.find(item => item.id === tag_id) as Tag;
    let parent_id = item?.parent_id;

    let parent_tags_result: Array<Tag> = [item];

    let count = 0;
    while ( parent_id && count < 10) {
      //console.log(parent_id);
      const parent_tag = tags.find(item => item.id === parent_id)!
      parent_tags_result.push(parent_tag);
      parent_id = parent_tag.parent_id;
      count++;
    }
    return Promise.resolve(parent_tags_result);
  }
  hostConnected(): void {}

  hostDisconnected(): void {}

}
