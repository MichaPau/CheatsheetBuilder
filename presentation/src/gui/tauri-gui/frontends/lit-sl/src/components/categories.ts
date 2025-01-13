import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { consume } from '@lit/context';

//import './category_node.js';
import sharedStyles from '../styles/shared-styles.js';
import { appContext, AppSettings } from '../utils/app-context.js';

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
      }

      #root-item::part(checkbox){
          visibility: false;
      }


    `
  ];

  @consume({ context: appContext, subscribe: true })
  @state()
  appSettings!: AppSettings;

  @property({type: Array})
  category_tree: Array<TreeNode> = [];

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("tree-sync-finished", (_e: Event) => {
      console.log("sync finished");
      const tree = this.shadowRoot?.querySelector("tree-view")!;
      const all = Array.from(
        tree.shadowRoot?.querySelectorAll("tree-item")!,
      ) as Array<TreeItem>;
      const f = all.filter((node) => node.selected);
      console.log("all:", all);
      console.log("f  :", f);
    });
  }


  onTreeItemExpand(ev: Event, id: number) {
    console.log("expand: ", id);
  }
  onTreeItemCollapse(ev: Event, id: number) {
     console.log("collpase: ", id);
  }

  log_event_start(data: Tag, ev:DragEvent) {
      ev.stopPropagation();
      ev.dataTransfer?.setData("text/plain", JSON.stringify(data));
      console.log("Start:", data.title, ";", data.id);
  };
  log_event_over(_data: Tag, ev:DragEvent) {
      ev.preventDefault();
  };
  log_event_drop(data: Tag,ev: DragEvent) {
      ev.stopPropagation();
      console.log("Drop on:", data.id, ";", data.title);
      let tag = JSON.parse(ev.dataTransfer?.getData("text/plain")!);
      console.log("Drop from:", tag.id,  ";", tag.title);
      const to_id: number | null = data.id != 0 ? data.id : null;
      //let ce = new CustomEvent("test_event", { detail: {from: tag.id, to: to_id}, bubbles: true, composed: true});
      let ce = new CustomEvent('update-parent-category', { detail: { tag_id: tag.id, new_parent_id: to_id }, bubbles: true, composed: true });
      this.dispatchEvent(ce);
  };

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
