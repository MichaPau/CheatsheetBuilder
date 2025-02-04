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
  {id: 1, title: "one", text: "snippet_one", created_at: 0, updated_at: 0, tags: [tags[4], tags[8]], text_type: "markdown"},
  {id: 2, title: "two", text: "snippet_two", created_at: 0, updated_at: 0, tags: [], text_type: "markdown"},
];

export function get_categories(): Array<Tag> {
  return tags.filter((tag) => tag.tag_type === "Category");
}
