import { css, html, LitElement, PropertyValues, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./tree-item.js";
import { TreeItem } from "../components/tree-item.js";

export type TreeNode = {
  item: Item;
  children: Array<TreeNode>;
};

export type Item = {
  id: number;
  title: string;
};

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

  @property()
  tree: TreeNode;

  constructor() {
    super();
    const root = { item: { id: 0, title: "Root" }, children: dummy_data };
    //const root = { item: { id: 0, title: "Root" }, children: [] };
    this.tree = root;
  }
  connectedCallback(): void {
    super.connectedCallback();

  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    //this.wait_update();
  }
  async wait_update() {
    let root = this.shadowRoot?.getElementById("root-item");
    const childs: NodeListOf<LitElement> =
      root?.shadowRoot?.querySelectorAll("tree-item")!;
    await Promise.all(
      Array.from(childs).map((c: LitElement) => c.updateComplete),
    );
    console.log("serial update complete on root tree-item");
  }
  renderSlots(treeNodes: Array<TreeNode>): TemplateResult {
    return html`
      ${treeNodes.map((item) => {
        return html` <tree-item id=${item.item.id} .data=${item}>
          ${this.renderSlots(item.children)}
        </tree-item>`;
      })}
    `;
  }

  renderExSlot(treeNodes: Array<TreeNode>) {
    return html`
      ${treeNodes.map((item) => {
        return html`<p>${item.item.title}</p>`;
      })}
    `;
  }
  render() {
    const h = html`
      <ul>
        <tree-item id="root-item" .data=${this.tree}>
          ${this.renderSlots(this.tree.children)}
        </tree-item>
      </ul>
    `;
    //console.log(h);
    return h;
  }
}

const dummy_data = [
  {
    item: {
      id: 1,
      title: "item_1",
    },
    children: [
      {
        item: {
          id: 11,
          title: "item_1.1",
          parent_id: 1,
        },
        children: [
          {
            item: {
              id: 111,
              title: "item_1.1.1",
              parent_id: 11,
            },
            children: [],
          },
          {
            item: {
              id: 112,
              title: "item_1.1.2",
              parent_id: 11,
            },
            children: [],
          },
        ],
        open: true,
      },
      {
        item: {
          id: 12,
          title: "item_1.2",
          parent_id: 1,
        },
        children: [],
      },
    ],
    open: true,
  },
  {
    item: {
      id: 2,
      title: "item_2",
    },
    children: [
      {
        item: {
          id: 21,
          title: "item_2.1",
          parent_id: 2,
        },
        children: [],
      },
      {
        item: {
          id: 22,
          title: "item_2.2",
          parent_id: 2,
        },
        children: [],
      },
    ],
    open: true,
  },
  {
    item: {
      id: 3,
      title: "item_3",
    },
    children: [],
  },
];
