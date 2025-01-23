import { css, html, LitElement, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { watch } from "../utils/watch";
import { TreeNode } from "./tree";
import { CustomMenu } from "./menu";
import { MenuDialog } from "./menu-dialog";

@customElement("tree-item")
export class TreeItem extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
        --spacing: 1.2rem;
        --icon-size: 1.5rem;
      }

      * {
        box-sizing: border-box;
      }
      .non-details-icon {
        //display: inline;
        width: var(--spacing);
        //height: var(--spacing);

        min-width: var(--spacing);
        //min-height: var(--spacing);
        text-align: center;
        vertical-align: middle;
      }
      .icon {
        display: inline-block;
        transition: 0.1s ease-in-out;

        text-align: center;
        align-content: center;

        width: var(--spacing);
        height: var(--spacing);

        min-width: var(--spacing);
        min-height: var(--spacing);

        img {
          display: block;
          max-width: var(--spacing);
          max-height: var(--spacing);
          width: var(--spacing);
          height: var(--spacing);
        }
      }
      input[type="checkbox"] {
        margin: 0;
        width: var(--spacing);
        height: var(--spacing);
        min-width: var(--spacing);
        min-height: var(--spacing);
        /* margin-right: 0.25em; */

      }
      .summary-row {
        display: flex;
        gap: 0.25em;
        align-items: center;
        align-content: center;
        font-size: var(--spacing);
        cursor: pointer;
      }

      details[open] > summary > .summary-row > .icon {
        transform: rotate(90deg);
      }

      summary {
        cursor: pointer;
        list-style: none;
      }
      details summary::-webkit-details-marker {
        display:none;
      }

      li {
        display: block;
        list-style: none;
        position: relative;
        //padding-left: calc(2 * var(--spacing) - var(--radius) - 2px);
        padding-left: var(--spacing);
      }
      ul {
        margin: 0;
        padding-left: 0;
        list-style: none;
      }
    `,
  ];

  @property({attribute: false})
  data!: TreeNode;

  @property({ attribute: false })
  selected: boolean = false;

  @property({attribute: false})
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

  connectedCallback(): void {
    super.connectedCallback();

  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    const title_elem = this.shadowRoot?.querySelector("#title-element")!;
    if (this.data.item.id == 0)
      console.log("title_elem:", title_elem);
    // title_elem.addEventListener("contextmenu", (ev: Event) => {
    //   ev.preventDefault();
    //   console.log("title contextmenu");
    // });
  }
  sync_parent() {
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

        p.sync_parent();
      }
    } else {
      console.log("outside tree");
      this.dispatchEvent(
        new Event("tree-sync-finished", { bubbles: true, composed: true }),
      );
    }
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
  }

  details_toggle_handler(id: number, ev: ToggleEvent) {

    console.log("details toggle in treeitem");
    const open = ev.newState === 'open' ? true : false;
    this.dispatchEvent(new CustomEvent('category_toggle', { detail: { tag_id: id, open}, bubbles: true, composed: true }));
  }
  onCreateMenu(ev: MouseEvent) {
    ev.preventDefault();
    let container = this.shadowRoot?.host.parentElement;
    while ( container instanceof TreeItem && container) {
      container = container.shadowRoot?.host.parentElement;
    }
    console.log("add menu container: ",container);
    const pos = { x: ev.pageX - 15, y: ev.pageY - 15 };

    const menu_item = new CustomMenu();
    menu_item.item = this.data.item;


    if (this.data.item.id === 0) {
      menu_item.isRoot = true;
    }
    menu_item.style.top = pos.y + "px";
    menu_item.style.left = pos.x + "px";
    //const container = this.shadowRoot!.querySelector(".summary-row")!;
    if(container)
      container.appendChild(menu_item);

    //document.body.appendChild(menu_item);

  }

  click_handler(_ev: Event) {
    //ev.preventDefault();
    this.selected = !this.selected;
    this.sync_cildren(this.selected);
    this.sync_parent();
    //console.log(this.selected);
  }

  // onEditTitle(ev: MouseEvent) {
  //   console.log("onEditTitle");
  //   const target = ev.target as HTMLElement;
  //   target.contentEditable = "plaintext-only";
  // }
  renderTreeItem() {
    if (this.data.children.length > 0) {
        return html` <li>
        <details @toggle=${(ev: ToggleEvent) => this.details_toggle_handler(this.data.item.id, ev)} ?open=${this.data.open}>
          <summary>
            <div class="summary-row" @contextmenu=${this.onCreateMenu}>
                <div class="icon"><img src="/src/assets/icons/east.svg" /></div>
              <input
                type="checkbox"
                value=${this.data.item.id}
                .checked=${this.selected}
                @click=${(ev: Event) => this.click_handler(ev)}
              /><span id="title-element">${this.data.item.title}</span>
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
            <div class="non-details-icon">&minus;</div>
          <input
            type="checkbox"
            ?checked=${this.selected}
            @click=${(ev: Event) => this.click_handler(ev)}
          /><span id="title-element">${this.data.item.title}</span>
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
