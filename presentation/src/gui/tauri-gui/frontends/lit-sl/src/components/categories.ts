import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { consume } from '@lit/context';

//import './category_node.js';
import sharedStyles from '../styles/shared-styles.js';
import { appContext, AppSettings, saveSettingsContext } from '../utils/app-context.js';

import { Tag } from '../types.js';

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

  @consume({ context: appContext, subscribe: true })
  @state()
  appSettings!: AppSettings;

  @consume({ context: saveSettingsContext, subscribe: true })
  update_selection!: (selected_ids: Array<number>) => void;

  @state()
  category_tree: Array<TreeNode> = [];

  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("tree-sync-finished", (_e: Event) => {
      console.log("sync finished");
      const tree = this.shadowRoot?.querySelector("tree-view")!;
      const all = Array.from(
        tree.shadowRoot?.querySelectorAll("tree-item")!,
      ) as Array<TreeItem>;
      const f = all.filter((node) => node.selected).map((node) => parseInt(node.id));

      console.log("f  :", f);
      //this.update_selection(f);
      this.appSettings.save_selected(f);
    });

    this.addEventListener("category_toggle", (ev: CustomEvent) => {
      this.appSettings.toggle_open(ev.detail.tag_id, ev.detail.open);
    });
  }


  onTreeItemExpand(_ev: Event, id: number) {
    console.log("expand: ", id);
  }
  onTreeItemCollapse(_ev: Event, id: number) {
     console.log("collpase: ", id);
  }



  on_root_drop(ev: DragEvent) {
    console.log("on root drop");
    let tag = JSON.parse(ev.dataTransfer?.getData("text/plain")!);
    console.log("Drop from:", tag.id,  ";", tag.title);
    let ce = new CustomEvent('update-parent-category', { detail: { tag_id: tag.id, new_parent_id: undefined }, bubbles: true, composed: true });
    this.dispatchEvent(ce);
  }



  render() {
    return html`
        <tree-view .category_tree=${this.category_tree}></tree-view>
    `;
  }
}
