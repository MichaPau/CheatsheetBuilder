

export type Tag = {
  id: number;
  title: string;
  tag_type: "Category" | "Normal" | "Untagged";
  parent_id?: number | null;
  tag_style?: object | null;
};

export type Snippet = {
  id: number;
  title: string;
  text: string;
  text_type: string;
  tags: Array<Tag>;
  created_at: number;
  updated_at: number;
}

// export type TreeCategory = {
//     item: Tag,
//     selected: boolean | undefined,
//     open: boolean | undefined,
//     children: Array<TreeCategory>
// };

//export const md = markdownit();

declare global {
  interface GlobalEventHandlersEventMap {
    'update-parent-category': CustomEvent<{tag_id: number, new_parent_id: number}>;
    'get-parent-tags': CustomEvent<{tag_id: number}>;
    'remove-tag-from-snippet': CustomEvent<{tag_id: number }>;
    'tree-sync-finished': Event;
    //'change-category-selection': CustomEvent<{id: number, state: boolean}>
  }
}
