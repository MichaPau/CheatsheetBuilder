import {createContext} from '@lit/context';

// export type AppSettings = {
//   open_categories: Array<number>,
//   selected_categories: Array<number>,
// }

export interface AppSettings {
  open_categories: Array<number>,
  selected_categories: Array<number>,
  toggle_open: (id: number, state: boolean) => void;
  save_selected: (ids: Array<number>) => void;
}

export const appContext = createContext<AppSettings>(Symbol('app-context'));

//this rather https://github.com/lit/lit/tree/main/packages/context
export const saveSettingsContext = createContext<(selected_ids: Array<number>) => void>(Symbol('save-context'));
