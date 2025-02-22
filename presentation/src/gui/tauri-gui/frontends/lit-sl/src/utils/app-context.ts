import {createContext} from '@lit/context';
import { SearchOrder, Snippet, Tag } from '../types';
import { TreeNode } from '../components/tree';

// export type AppSettings = {
//   open_categories: Array<number>,
//   selected_categories: Array<number>,
// }

export interface AppData {
  snippets: Array<Snippet>,
  categories: Array<TreeNode>,


}
export interface AppSettings {
  open_categories: Array<number>,
  selected_categories: Array<number>,
  search_order: Array<SearchOrder>,
  toggle_open: (id: number, state: boolean) => void;
  save_selected: (ids: Array<number>) => void;
  save_search_order: (order: Array<SearchOrder>) => void;
}

export const appSettingContext = createContext<AppSettings>(Symbol('app-setting-context'));
export const appDataContext = createContext<AppData>(Symbol('app-data-context'));

//this rather https://github.com/lit/lit/tree/main/packages/context
export const saveSettingsContext = createContext<(selected_ids: Array<number>) => void>(Symbol('save-context'));
