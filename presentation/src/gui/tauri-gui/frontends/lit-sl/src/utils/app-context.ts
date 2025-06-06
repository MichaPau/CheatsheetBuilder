import {createContext} from '@lit/context';
import { Log_Level, SearchOrder, Snippet } from '../types';
import { TreeNode } from '../components/tree';

export interface AppDataSnippets {
  snippets: Array<Snippet>
}
export interface AppDataCategories {
  categories: Array<TreeNode>
}

export interface AppSettings {
  open_categories: Array<number>,
  selected_categories: Array<number>,
  search_order: Array<SearchOrder>,
  tag_filter: Array<number>,
  category_filter_flag: boolean,
  log_level: Log_Level,
  toggle_open: (id: number, state: boolean) => void;
  set_category_filter_flag: (state: boolean) => void,
  save_selected: (ids: Array<number>) => void;
  save_search_order: (order: Array<SearchOrder>) => void;
  save_tag_filter: (tags: Array<number>) => void;
}

export const appSettingContext = createContext<AppSettings>(Symbol('app-setting-context'));
export const appDataSnippetsContext = createContext<AppDataSnippets>(Symbol('app-data-snippets-context'));
export const appDataCategoriesContext = createContext<AppDataCategories>(Symbol('app-data-categories-context'));
//export const appDataContext = createContext<AppData>(Symbol('app-data-context'));

//this rather https://github.com/lit/lit/tree/main/packages/context
export const saveSettingsContext = createContext<(selected_ids: Array<number>) => void>(Symbol('save-context'));
