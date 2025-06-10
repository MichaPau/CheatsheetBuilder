import { InvokeArgs, InvokeOptions } from "@tauri-apps/api/core";
import { Snippet, Tag } from "../../types";

export let tags: Array<Tag> = [
  { id: 1, title: "First", tag_type: "Category", parent_id: null, tag_style: null },
  { id: 11, title: "Sub1", tag_type: "Category", parent_id: 1, tag_style: null },
  { id: 12, title: "Sub2", tag_type: "Category", parent_id: 1, tag_style: null },
  { id: 13, title: "Sub3", tag_type: "Category", parent_id: 1, tag_style: null },
  { id: 111, title: "Sub1.1", tag_type: "Category", parent_id: 11, tag_style: null },
  { id: 112, title: "Sub1.2", tag_type: "Category", parent_id: 11, tag_style: null },
  { id: 4, title: "Second", tag_type: "Category", parent_id: null, tag_style: null },
  { id: 6, title: "Third", tag_type: "Category", parent_id: null, tag_style: null },

  { id: 1001, title: "Tag1", tag_type: "Normal", parent_id: null, tag_style: null },
  { id: 1002, title: "Tag2", tag_type: "Normal", parent_id: null, tag_style: null },
  { id: 1003, title: "Tag3", tag_type: "Normal", parent_id: null, tag_style: null },
];

export let snippets: Array<Snippet> = [
  {id: 1, title: "one", text: "snippet_one", created_at: 0, updated_at: 0, tags: [], text_type: "Markdown"},
  {id: 2, title: "two", text: "snippet_two", created_at: 0, updated_at: 0, tags: [], text_type: "Markdown"},
];

export let snippet_tags: Array<{ snippet_id: number, tag_id: number }> = [
  { snippet_id: 1, tag_id: 1 },
  { snippet_id: 1, tag_id: 11 },
  { snippet_id: 1, tag_id: 1001 },
  { snippet_id: 2, tag_id: 111 },
  { snippet_id: 2, tag_id: 1002 },
];

export function invoke(cmd:string,args:InvokeArgs = {},_options?:InvokeOptions): Promise<any> {

  return new Promise(async (resolve, reject) => {
    switch (cmd) {
      case "get_snippets":
        resolve(get_snippets());
        break;
      case "get_categories":
        resolve(get_categories());
        break;
      //tagId
      case "get_parent_tags": 
        resolve(get_parent_tags((args as any).tagId));
        break;
      case "get_tags"://tagIdFilter,
        resolve(get_tags((args as any).tagIdList));
        break;
      case "append_tag": //snippetId, tagId
      case "search_tags": //pattern
      case "update_snippet_title": //id, newTitle
      case "remove_tag_from_snippet": //snippetId, tagId
      case "update_tag_title": //tagId, newTitle
      case "get_snippet_count_for_tag": //tagId
      case "delete_category": //tagId
      case "create_category": //parentId, title
      case "set_tag_parent_id": //tagid, newParentId
      case "delete_snippet": //id
      case "update_snippet_text": //id, newText, textType
      case "create_tag": //title
      case "create_snippet": //title, text, textType, tagIds
      
      default:
        reject("not implemented");
    }
  })
}
export function get_categories(): Array<Tag> {
  const result: Array<Tag> = [];
  const draft = tags.filter((tag) => tag.tag_type === "Category");
  for (const cat of draft) {
    result.push(cat);
  }
  return result;

}
export function get_snippets() {
  const result: Array<Snippet> = [];
  for (let snippet of snippets) {
    let tag_ids: Array<number> = snippet_tags.filter((item) => {

      return item.snippet_id === snippet.id;
    }).map((item) => item.tag_id);
    let st = tags.filter((tag) => tag_ids.includes(tag.id));
    snippet.tags = st;
    result.push(snippet);
  }

  return result
}
function get_parent_tags(tag_id: number) {
  const tag = tags.find((tag) => tag.id === tag_id);
  let result = [tag];
  let parent_id = tag?.parent_id;
  while (parent_id) {
    const p_tag = tags.find((tag) => tag.id === parent_id);
    if(p_tag) {
      result.push(p_tag);
      parent_id = p_tag.parent_id;
    } else {
      parent_id = null;
    }
  }
  return result;  
}
function get_tags(id_list: Array<number>) {
  const result = tags.filter((tag) => id_list.includes(tag.id));
  return result;
}
export function generate_random_snippets(size: number) {

  snippets = [];
  for (let i = 1; i <= size; i++) {
    let snippet: Snippet = {
      id: i, title: "Snippet_" + i, text: "SnippetContent for " + i, tags: [], created_at: 0, updated_at: 0, text_type:"Markdown"
    };
    let s_tags: Array<Tag> = [];
    const tag_count = range(0, tags.length);
    while( s_tags.length < tag_count) {
      var t = tags[range(0, tags.length)];
      if (s_tags.findIndex((_t => _t.id === t.id)) == -1) s_tags.push(t);
    }
    //console.log("snippet tags: ", s_tags, " count: ", tag_count);
    snippet.tags = s_tags;
    snippets.push(snippet);

  }
}


function range(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}
