import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import sharedStyles from '../styles/shared-styles.js';
import { Tag } from '../types.js';

import './tree-item.js';
import { TreeItem } from './tree-item.js';

export type TreeNode = {
  item: Tag,
  selected: boolean | undefined,
  open: boolean | undefined,
  children: Array<TreeNode>
}
//based on article
//https://iamkate.com/code/tree-views/
@customElement('tree-view')
export class TreeView extends LitElement {
  static styles = [
    sharedStyles,
    css `
      :host {
        display: block;
      }

      details > summary > .summary-row::before {
          content: var(--closed-content);
      }

      details[open] > summary > .summary-row::before {
          content: var(--open-content);
          display: inline-block;
          text-align: center;

      }
      summary {
        cursor: pointer;
        list-style: none;
      }

      .summary-row {
          display: inline-flex;
          align-items: center;
          /* border: 1px solid black; */
      }
      #root-item {
          --spacing: 0.5rem;
          --radius: 0px;
          --open-content: "|";
          --closed-content: "-";

          &:first-child {
              margin: 0;
              padding-left: 0;
          }
          & .summary-row {
              display: inline-flex;
              align-items: center;
              /* border: 1px solid black; */
          }
          & li {
            display: block;
            list-style: none;
            position: relative;
            padding-left: calc(2 * var(--spacing) - var(--radius) - 2px);
          }
          & ul {
            /* margin-left: calc(var(--radius) - var(--spacing)); */
            padding-left: 0;
            list-style: none;
          }
      }
      .non-details > .summary-row {
          &:before {content: var(--open-content);}
      }
      /* .tree li {
        display: block;
        position: relative;
        padding-left: calc(2 * var(--spacing) - var(--radius) - 2px);
      }

      .tree ul {
        margin-left: calc(var(--radius) - var(--spacing));
        padding-left: 0;
      } */
    `
  ];

  // @property({type: Array})
  // category_tree: Array<TreeNode> = [];
  private _category_tree: Array<TreeNode> = [];

  @property({type: Array})
  set category_tree(v: Array<TreeNode>) {
    this._category_tree = v;
    this.rootNode = {
        item: { id: 0, title: "Root", parent_id: null, tag_style: null, tag_type:  "Category" },
      open: true,
      selected: false,
      children: v,
    };
  }

  get category_tree() {
    return this._category_tree;
  }


  @state()
  rootNode: TreeNode = {
      item: { id: 0, title: "Root", parent_id: null, tag_style: null, tag_type:  "Category" },
    open: true,
    selected: false,
    children: this._category_tree,
  };
  connectedCallback(): void {
    super.connectedCallback();
  }

  // findNode(tree: Array<TreeCategory>, id: number): TreeCategory | undefined {
  //   for(let node of tree){
  //     if (node.item.id === id) return node;

  //     if(node.children) {
  //       let tempNode = this.findNode(node.children, id);
  //       if (tempNode) return tempNode;
  //     }
  //   }

  //   return undefined;
  // }



  // selection_changed2 = (ev: Event, node: TreeCategory) => {
  //   console.log("selection change2");
  //   const target = ev.target as HTMLInputElement;
  //   const state = target.checked;
  //   let found = this.findNode(this.category_tree, node.item.id);

  //   if (found) {
  //     console.log("found node");
  //     this.change_selection_state(found, state);
  //   };
  //   console.log("tree:", this.category_tree);
  //   this.requestUpdate();
  //   this.performUpdate();

  // }
  //
  get_all_selection_states() {
    const root = this.shadowRoot?.querySelector("#root-item");
    const all = Array.from(root?.getElementsByTagName("input")!);
    let r = all.map((child: HTMLInputElement) => {
      if (child.checked) return child.value;
    });

    let r2 = all.reduce((ids: Array<string>, item: HTMLInputElement) => {
      if (item.checked) {
        ids.push(item.value);
      }
      return ids;
    }, []);

    console.log(r2);
  }
  selection_changed(ev: Event) {
    const target = ev.target as HTMLInputElement;
    const state = target.checked;
    const closest = target.closest("ul");
    if (closest) {
      const childs = closest.getElementsByTagName("input");
      //console.log("childs:", childs);
      for (const input of childs) {
        //console.log("child:", input);
        (input as HTMLInputElement).checked = state;
      }
    }

    this.get_all_selection_states();
  }


  root_selection_changed = (ev:Event) => {

    const root_input = ev.target as HTMLInputElement;
    const state = root_input.checked;

    const childs = this.shadowRoot?.querySelectorAll("tree-item")!;
    for (const child of childs) {
      (child as TreeItem).setSelected(state);
    }
  }

  render() {
    return html`
        <ul id="root-item">
            <tree-item .data=${this.rootNode}></tree-item>
        </ul>
    `;
  }
}

//@change=${(ev: Event) => this.selection_changed(ev, node)}/>

// <li>
//     <details open>
//         <summary><div class="summary-row"><input value="0" type="checkbox" @change=${this.root_selection_changed}/>Root</div></summary>
//         <ul>
//             ${this.category_tree.map((child) => html`<tree-item .data=${child}></tree-item>`)}
//         </ul>

//     </details>
// </li>
