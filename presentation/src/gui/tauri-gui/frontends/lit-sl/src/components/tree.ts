import { css, html, LitElement, PropertyValues, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./tree-item.js";

import { Tag } from "../types.js";

export type TreeNode = {
  item: Tag;
  selected?: boolean | null;
  open?: boolean | null;
  children: Array<TreeNode>;
};

// export type Item = {
//   id: number;
//   title: string;
// };

@customElement("tree-view")
export class Tree extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
        --spacing: 0.5rem;
        --radius: 0px;
        --bullet-width: 0.75em;

        & ul {
          padding-left: 0;
          list-style: none;
        }
      }
    `,
  ];

  @state()
  tree!: TreeNode;

  @state()
  category_tree: Array<TreeNode> = [];

  constructor() {
    super();
    // const root = { item: { id: 0, title: "Root", tag_type: "Category"} as Tag, open: true, selected: false, children: [] };
    // this.tree = root;
  }

  protected willUpdate(_changedProperties: PropertyValues): void {

    if(_changedProperties.has("category_tree")) {
     // console.log(_changedProperties);
     //const root = { item: { id: 0, title: "Root", tag_type: "Category"} as Tag, children: dummy_data };
      const root = { item: { id: 0, title: "Root", tag_type: "Category"} as Tag, open: true, selected: false, children: this.category_tree };

      this.tree = root;
    }
  }
  connectedCallback(): void {
    super.connectedCallback();

  }

  drag_event_start(data: Tag, ev:DragEvent) {
      ev.stopPropagation();
      ev.dataTransfer?.setData("text/plain", JSON.stringify(data));
      console.log("Start:", data.title, ";", data.id);
  };
  drag_event_over(ev:DragEvent) {
      ev.preventDefault();
  };
  drop_event(data: Tag,ev: DragEvent) {
      ev.stopPropagation();
      console.log("Drop on:", data.id, ";", data.title);
      let tag = JSON.parse(ev.dataTransfer?.getData("text/plain")!);
      console.log("Drop from:", tag.id,  ";", tag.title);
      const to_id: number | null = data.id != 0 ? data.id : null;

      let ce = new CustomEvent('update-parent-category', { detail: { tag_id: tag.id, new_parent_id: to_id }, bubbles: true, composed: true });
      this.dispatchEvent(ce);
  };

  renderSlots(treeNodes: Array<TreeNode>): TemplateResult {
    return html`
      ${treeNodes.map((item) => {
        return html`
            <tree-item
                id=${item.item.id} .data=${item} draggable="true"
                @dragstart=${(ev: DragEvent) => this.drag_event_start(item.item, ev)}
                @dragover=${this.drag_event_over}
                @drop=${(ev: DragEvent) => this.drop_event(item.item, ev)}>
                ${this.renderSlots(item.children)}
            </tree-item>
        `;
      })}
    `;
  }

  render() {
    const h = html`
      <ul>
        <tree-item
            id="0" .data=${this.tree}
            @dragover=${this.drag_event_over}
            @drop=${(ev: DragEvent) => this.drop_event(this.tree.item, ev)}>
          ${this.renderSlots(this.tree.children)}
        </tree-item>
      </ul>
    `;
    //console.log(h);
    return h;
  }
}

// const dummy_data: Array<TreeNode> = [
//   {
//     item: {
//       id: 1,
//       title: "item_1",
//       tag_type: "Category",
//     },
//     children: [
//       {
//         item: {
//           id: 11,
//           title: "item_1.1",
//           tag_type: "Category",
//           parent_id: 1,
//         },
//         children: [
//           {
//             item: {
//               id: 111,
//               title: "item_1.1.1",
//               tag_type: "Category",
//               parent_id: 11,
//             },
//             children: [],
//           },
//           {
//             item: {
//               id: 112,
//               title: "item_1.1.2",
//               tag_type: "Category",
//               parent_id: 11,
//             },
//             children: [],
//           },
//         ],
//         open: true,
//       },
//       {
//         item: {
//           id: 12,
//           title: "item_1.2",
//           tag_type: "Category",
//           parent_id: 1,
//         },
//         children: [],
//       },
//     ],
//     open: true,
//   },
//   {
//     item: {
//       id: 2,
//       title: "item_2",
//       tag_type: "Category",
//     },
//     children: [
//       {
//         item: {
//           id: 21,
//           title: "item_2.1",
//           tag_type: "Category",
//           parent_id: 2,
//         },
//         children: [],
//       },
//       {
//         item: {
//           id: 22,
//           title: "item_2.2",
//           tag_type: "Category",
//           parent_id: 2,
//         },
//         children: [],
//       },
//     ],
//     open: true,
//   },
//   {
//     item: {
//       id: 3,
//       title: "item_3",
//       tag_type: "Category",
//     },
//     children: [],
//   },
// ];
