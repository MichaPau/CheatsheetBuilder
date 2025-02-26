

export type Tag = {
  id: number;
  title: string;
  tag_type: string;
  parent_id: number | null;
  tag_style: object | null;
};
//"Category" | "Normal" | "Untagged";
export type Snippet = {
  id: number;
  title: string;
  text: string;
  text_type: TextType;
  tags: Array<Tag>;
  created_at: number;
  updated_at: number;
};

export type TextType = "Text" | "Markdown";

export enum Order {
  NONE,
  ASC,
  DESC,
}

export type SearchOrder = {
  title: string,
  value: string,
  order: Order,
}

// export type TreeCategory = {
//     item: Tag,
//     selected: boolean | undefined,
//     open: boolean | undefined,
//     children: Array<TreeCategory>
// };

//export const md = markdownit();

// export { default as MainInvoker } from './invokers/main-invoker.js';
// export { default as SnippetInvoker} from './invokers/snippet-invoker.js';
// export { default as CategoriesInvoker } from './invokers/categories-invoker.js';
// export { default as TagListInvoker } from './invokers/tag-list-invoker.js';

export { default as MainInvoker } from './invokers/mock-invokers/main-invoker.js';
export { default as SnippetInvoker} from './invokers/mock-invokers/snippet-invoker.js';
export { default as CategoriesInvoker } from './invokers/mock-invokers/categories-invoker.js';
export { default as TagListInvoker} from './invokers/mock-invokers/tag-list-invoker.js';


declare global {
  interface GlobalEventHandlersEventMap {
    'reload-snippets': Event;
    'reload_snippets-settings-change': Event;
    'update-parent-category': CustomEvent<{tag_id: number, new_parent_id: number}>;
    'get-parent-tags': CustomEvent<{tag_id: number}>;
    'remove-tag-from-snippet': CustomEvent<{tag_id: number }>;
    'tree-sync-finished': Event;
    'category-toggle': CustomEvent<{ tag_id: number, open: boolean }>;
    'set-selected-categories': CustomEvent<{ids: number[]}>;
    'update-category-title': CustomEvent<{ tag_id: number, new_title: string}>;
    'delete_category': CustomEvent<{ tag_id: number, title: string }>;
    'add-category': CustomEvent<{ parent_id: number, title: string }>;
    'create-snippet': CustomEvent<{ snippet: Snippet}>;
    'editor-content-update': CustomEvent<{ content_text: string, text_type: TextType }>,
    'add-search-tag': CustomEvent<{ tag: Tag}>,
    'create-search-tag': CustomEvent<{ label: string}>

    //'change-category-selection': CustomEvent<{id: number, state: boolean}>
  }
}
