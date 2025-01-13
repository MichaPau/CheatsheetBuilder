import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { watch } from "../utils/watch";
import { TreeNode } from "./tree";

@customElement("tree-item")
export class TreeItem extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }

      details > summary > .summary-row::before {
        content: "→";
        display: inline-block;
        width: var(--bullet-width);
      }

      details[open] > summary > .summary-row::before {
        content: "↓";
        display: inline-block;
        width: var(--bullet-width);
      }
      summary {
        cursor: pointer;
        list-style: none;
      }

      .non-details > .summary-row {
        &:before {
          content: "-";
          display: inline-block;
          text-align: right;
          width: var(--bullet-width);
        }
      }
      li {
        display: block;
        list-style: none;
        position: relative;
        padding-left: calc(2 * var(--spacing) - var(--radius) - 2px);
      }
      ul {
        margin: 0;
        padding-left: 0;
        list-style: none;
      }
    `,
  ];

  @property()
  data!: TreeNode;

  @property({ attribute: false })
  selected: boolean = false;

  @property()
  indeterminate: boolean = false;

  @query('input[type="checkbox"]') input!: HTMLInputElement;

  @watch(["selected"], { waitUntilFirstUpdate: true })
  handleStateChangeSelected() {
    //console.log("handleStateChange:", this.input, this.selected);
    this.input.checked = this.selected; // force a sync update
  }
  @watch(["indeterminate"], { waitUntilFirstUpdate: true })
  handleStateChangeIndeterminate() {
    //console.log("handleStateChange:", this.input, this.selected);
    this.input.indeterminate = this.indeterminate; // force a sync update
  }

  sync_parent2() {
    const t = this.shadowRoot?.host as TreeItem;
    const p = t.parentElement;
    //console.log(p);
    if (p && p instanceof TreeItem) {
      const slot = p.shadowRoot?.querySelector("slot");
      if (slot) {
        const childs: Array<TreeItem> = slot.assignedElements({
          flatten: false,
        }) as Array<TreeItem>;
        //console.log("children:", childs);
        const all_selected = childs.every((child: TreeItem) => child.selected);
        const all_deselected = childs.every(
          (child: TreeItem) => !child.selected && !child.indeterminate,
        );
        if (all_selected && !p.selected) {
          p.selected = true;
          p.indeterminate = false;
          //this.input.checked = true;
        }

        if (all_deselected && p.selected) {
          p.selected = false;
          p.indeterminate = false;
          //this.input.checked = false;
        }

        if (!all_selected && !all_deselected) {
          p.selected = false;
          p.indeterminate = true;
        } else {
          p.indeterminate = false;
        }

        p.sync_parent2();
      }
    } else {
      console.log("outside tree");
      this.dispatchEvent(
        new Event("tree-sync-finished", { bubbles: true, composed: true }),
      );
    }
  }
  sync_parent() {
    const p = this.shadowRoot?.host as TreeItem;
    const t = (p?.parentElement?.getRootNode() as ShadowRoot).host;

    if (t && t instanceof TreeItem) {
      const c = t.shadowRoot?.host?.closest("tree-item") as TreeItem;
      if (c) {
        console.log(c);
        const childs: Array<TreeItem> = Array.from(
          c.shadowRoot?.querySelectorAll("tree-item")!,
        );
        const all_selected = childs.every((child: TreeItem) => child.selected);
        const all_deselected = childs.every(
          (child: TreeItem) => !child.selected && !child.indeterminate,
        );
        if (all_selected && !c.selected) {
          c.selected = true;
          c.indeterminate = false;
          //this.input.checked = true;
        }

        if (all_deselected && c.selected) {
          c.selected = false;
          c.indeterminate = false;
          //this.input.checked = false;
        }

        if (!all_selected && !all_deselected) {
          c.selected = false;
          c.indeterminate = true;
        } else {
          c.indeterminate = false;
        }

        c.sync_parent();
      }
    } else {
      console.log("outside tree");
    }

    // const r = this.shadowRoot?.host.getRootNode().parentElement;
    // if (r) {
    //   const t = r.host;
    //   console.log(t);
    //   const c = t.closest("tree-item");
    //   if (c) {
    //     const parent = c as TreeItem;
    //     const childs = parent.querySelectorAll("tree-item");
    //     console.log(childs);
    //     for (const c of childs) {
    //       const i = c as TreeItem;
    //       console.log(i.data.item.title);
    //     }
    //   }
    // }
  }
  sync_cildren(state: boolean) {
    const slot = this.shadowRoot?.querySelector("slot");
    if (slot) {
      const children = slot.assignedElements({ flatten: false });
      //console.log(slot_childs);
      //const children = this.shadowRoot?.querySelectorAll("tree-item");
      if (children) {
        for (const child of children) {
          (child as TreeItem).selected = state;
          (child as TreeItem).sync_cildren(state);
        }
      }
    }
  }
  selection_changed() {
    this.input.checked = this.selected;
    // const state = (ev.target as HTMLInputElement).checked;
    // this.selected = state;
    // this.sync_cildren(state);
  }

  click_handler(ev: Event) {
    //ev.preventDefault();
    this.selected = !this.selected;
    this.sync_cildren(this.selected);
    this.sync_parent2();
    //console.log(this.selected);
  }


  renderTreeItem() {
    if (this.data.children.length > 0) {
      return html` <li>
        <details open>
          <summary>
            <div class="summary-row">
              <input
                type="checkbox"
                value=${this.data.item.id}
                .checked=${this.selected}
                @click=${(ev: Event) => this.click_handler(ev)}
              />${this.data.item.title}
            </div>
          </summary>
          <ul>
            <slot></slot>
          </ul>
        </details>
      </li>`;
    } else {
      return html`<li class="non-details">
        <div class="summary-row">
          <input
            type="checkbox"
            ?checked=${this.selected}
            @click=${(ev: Event) => this.click_handler(ev)}
          />${this.data.item.title}
        </div>
      </li>`;
    }
  }
  render() {
    return this.renderTreeItem();
    // return html` <li>
    //   ${this.data.item.title}
    //   <slot></slot>
    // </li>`;
  }
}
