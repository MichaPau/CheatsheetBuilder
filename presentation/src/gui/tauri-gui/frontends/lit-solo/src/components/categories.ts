import { html, css, LitElement } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { consume } from '@lit/context';

//import './category_node.js';
import mainStyles from '../styles/mainStyle.js';
import { appContext, AppSettings } from '../utils/app-context.js';

import { Tag, TreeCategory} from '../types.js';

@customElement('category-tree')
export class Categories extends LitElement {
  static styles = [
    mainStyles,
    css `
      :host {
        display: block;
      }

      #root-item::part(checkbox){
          visibilty: false;
      }
    `
  ];

  @consume({context: appContext})
  appSettings!: AppSettings;

  @property({type: Array})
  category_tree: Array<TreeCategory> = [];

  connectedCallback(): void {
    super.connectedCallback();
    console.log("connectedCallback");
  }

  onTreeItemChange(ev: CustomEvent) {
    console.log("onTreeItemChange", ev);
    let ids: Array<string> = [];
    ev.detail.selection.map((item: HTMLElement) => {
      ids.push(item.getAttribute("tag_id")!);
    });
    console.log(ids);
    this.dispatchEvent(new CustomEvent("set-selected-categories", { bubbles: true, composed: true, detail: ids }));
    //this.appSettings.open_categories = ids;
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
  renderTemplate(node: TreeCategory): any {

    return html`
    <sl-tree-item tag_id=${node.item.id}
        draggable="true"
        @sl-expand=${(ev: Event) => this.onTreeItemExpand(ev, node.item.id)}
        @sl-collapse=${(ev: Event) => this.onTreeItemCollapse(ev, node.item.id)}
        @drop=${(ev: DragEvent) => this.log_event_drop(node.item, ev)}
        @dragstart=${(ev: DragEvent) => this.log_event_start(node.item, ev)}
        @dragover=${(ev: DragEvent) => this.log_event_over(node.item, ev)}>
        ${node.item.title}
        ${node.children.map((child) =>
            this.renderTemplate(child)
        )}

    </sl-tree-item>`;
}


  render() {
    return html`

        <sl-tree-item id="root-item" @drop=${this.on_root_drop} @dragover=${(ev: DragEvent) => { ev.preventDefault()}}>
            Root
        </sl-tree-item>
        <sl-tree selection="multiple" @sl-selection-change=${this.onTreeItemChange}>

            ${this.category_tree.map((node) => {
                return this.renderTemplate(node);
            }

            )}
        </sl-tree>
    `;
  }
}
