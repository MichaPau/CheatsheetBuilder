

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

// export { default as MainInvoker } from './invokers/main-invoker.js';
// export { default as SnippetInvoker} from './invokers/snippet-invoker.js';
// export { default as CategoriesInvoker } from './invokers/categories-invoker.js';
// export { default as TagListController } from './invokers/tag-list-invoker.js';

export { default as MainInvoker } from './invokers/mock-invokers/main-invoker.js';
export { default as SnippetInvoker} from './invokers/mock-invokers/snippet-invoker.js';
export { default as CategoriesInvoker } from './invokers/mock-invokers/categories-invoker.js';
export { default as TagListInvoker} from './invokers/mock-invokers/tag-list-invoker.js';


declare global {
  interface GlobalEventHandlersEventMap {
    'update-parent-category': CustomEvent<{tag_id: number, new_parent_id: number}>;
    'get-parent-tags': CustomEvent<{tag_id: number}>;
    'remove-tag-from-snippet': CustomEvent<{tag_id: number }>;
    'tree-sync-finished': Event;
    'category_toggle': CustomEvent<{ tag_id: number, open: boolean }>;
    'update_category_title': CustomEvent<{ tag_id: number, new_title: string}>;
    'delete_category': CustomEvent<{ tag_id: number, title: string }>;
    'add_category': CustomEvent<{ parent_id: number, title: string }>;
    //'change-category-selection': CustomEvent<{id: number, state: boolean}>
  }
}
