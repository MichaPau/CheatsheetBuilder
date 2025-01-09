import {createContext} from '@lit/context';

export type AppSettings = {
  //categories_settings: Array<{ id: number, selected: boolean, open: boolean }>;
  open_categories: Array<number>,
  selected_categories: Array<number>,
}
export const appContext = createContext<AppSettings>(Symbol('app-context'));
