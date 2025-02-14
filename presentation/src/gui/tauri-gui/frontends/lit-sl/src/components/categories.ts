import { html, css, LitElement, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { consume, ContextConsumer, ContextType } from '@lit/context';

//import './category_node.js';
import sharedStyles from '../styles/shared-styles.js';
import { appSettingContext, AppSettings, saveSettingsContext, appDataContext, AppData } from '../utils/app-context.js';



import './tree.js';
import { TreeNode } from './tree.js';
import { TreeItem } from './tree-item.js';


@customElement('category-tree')
export class Categories extends LitElement {
  static styles = [
    sharedStyles,
    css `
      :host {
        display: block;
        overflow: auto;
        height: 100%;
        box-sizing: border-box;
      }

      #root-item::part(checkbox){
          visibility: false;
      }


    `
  ];



  @consume({ context: appSettingContext, subscribe: true })
  @state()
  appSettings!: AppSettings;

  @consume({ context: saveSettingsContext, subscribe: true })
  update_selection!: (selected_ids: Array<number>) => void;

  @consume({ context: appDataContext, subscribe: true })
  @state()
  appData!: AppData;

  @state()
  category_tree: Array<TreeNode> = [];

  //private _invoker: CategoriesInvoker = new CategoriesInvoker(this);

  protected shouldUpdate(_changedProperties: PropertyValues): boolean {
    //console.log("Categories::shouldUpdate", _changedProperties);
    return super.shouldUpdate(_changedProperties);
  }
  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("tree-sync-finished", (_e: Event) => {

      const tree = this.shadowRoot?.querySelector("tree-view")!;
      const all = Array.from(
        tree.shadowRoot?.querySelectorAll("tree-item")!,
      ) as Array<TreeItem>;
      const f = all.filter((node) => node.selected).map((node) => parseInt(node.id));
      this.appSettings.save_selected(f);
    });

    this.addEventListener("category-toggle", (ev: CustomEvent) => {
      this.appSettings.toggle_open(ev.detail.tag_id, ev.detail.open);
    });
  }

  // on_root_drop(ev: DragEvent) {
  //   console.log("on root drop");
  //   let tag = JSON.parse(ev.dataTransfer?.getData("text/plain")!);
  //   console.log("Drop from:", tag.id,  ";", tag.title);
  //   let ce = new CustomEvent('update-parent-category', { detail: { tag_id: tag.id, new_parent_id: undefined }, bubbles: true, composed: true });
  //   this.dispatchEvent(ce);
  // }



  render() {
    return html`
        <tree-view .category_tree=${this.appData.categories}></tree-view>
    `;
  }
}
