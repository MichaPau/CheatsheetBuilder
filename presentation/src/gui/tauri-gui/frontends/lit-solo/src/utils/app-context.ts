import {createContext} from '@lit/context';

export type AppSettings = {
  //categories_settings: Array<{ id: number, selected: boolean, open: boolean }>;
  open_categories: Array<string>,
  selected_categories: Array<string>,
}
export const appContext = createContext<AppSettings>('app-context');
