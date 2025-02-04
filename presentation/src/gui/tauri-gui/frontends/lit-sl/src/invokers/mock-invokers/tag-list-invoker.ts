import { ReactiveController, ReactiveControllerHost } from "lit";

import { SnippetTagList } from "../../components/snippet-tag-list";
import { Tag } from "../../types";

import { tags } from "./mockData";

export default class TagListInvoker implements ReactiveController {
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
