import { html, css, LitElement, PropertyValues } from 'lit';
import { customElement, state, property, query } from 'lit/decorators.js';
import { TreeNode } from './tree-view';
import { LitElementLightDOM } from '../utils/litlightdom';


//import sharedStyles from '../styles/shared-styles.js';

@customElement('tree-item')
export class TreeItem extends LitElementLightDOM {
  static styles = [
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
      li {
        display: block;
        list-style: none;
        position: relative;
        padding-left: calc(2 * var(--spacing) - var(--radius) - 2px);
      }
      ul {
        /* margin-left: calc(var(--radius) - var(--spacing)); */
        margin: 0;
        padding-left: 0;
        list-style: none;
      }
      .non-details > .summary-row {
          &:before {content: var(--open-content);}
      }
    `
  ];

  @query("#input")
  input!: HTMLInputElement;

  @property({ attribute: false })
  data!: TreeNode;

  @property({type: Boolean})
  selected = false;

  @property({type: Boolean})
  indeterminate = false;

  connectedCallback(): void {
    super.connectedCallback();
  }


  updateFromChild = () => {
    console.log("update from child", this.data.item.title);
    const childs = Array.from(this.querySelectorAll(":scope tree-item")) as Array<TreeItem>;
    console.log(childs);
    const all_selected = childs.every((child: TreeItem) => child.selected === true);
    const all_deselected = childs.every((child: TreeItem) => child.selected === false);
    if (all_selected && !this.selected) {
      this.selected = true;
      this.input.checked = true;
    }

    if (all_deselected && this.selected) {
      this.selected = false;
      this.input.checked = false;
    }


    if (this.data.item.title==='Sub1') {
      console.log("state: ", this.selected);
    }
    console.log(all_selected, all_deselected);
    if(!all_selected && !all_deselected) {
      this.indeterminate = true;
      this.input.indeterminate = true;
    } else {
      this.indeterminate = false;
      this.input.indeterminate = false;
    }

    this.requestUpdate();

  }
  setSelected(state: boolean) {
    //console.log("setSelected for:", this.data.item.id);
    this.selected = state;
    this.data = { ...this.data, selected: this.selected };
    this.input.checked = this.selected;



    this.dispatchEvent(new CustomEvent("change-category-selection", { bubbles: true, composed: true, detail: { id: this.data.item.id, state: this.selected } }));
    if (this.data.children.length > 0) {
      //const childs = this.shadowRoot?.querySelectorAll("tree-item")!;
      const childs = this.querySelectorAll("tree-item")!;
      for (const child of childs) {
        (child as TreeItem).setSelected(this.selected);
      }
    }
    const parent = this.parentElement!.closest("tree-item");
    if (parent !== null) {
      console.log("parent: ", (parent as TreeItem).data.item.title);
      (parent as TreeItem).updateFromChild();
    }
      else
      console.log("parent is null");
  }


  selectionChanged(ev: Event) {
    const target = ev.target as HTMLInputElement;
    this.setSelected(target.checked);
  }
  renderTemplate(node: TreeNode): any {

    if (node.children.length > 0) {
      return html`
      <li>
          <details ?open=${node.open}>
              <summary>
                  <div class="summary-row">
                      <input id="input" type="checkbox"
                          value=${node.item.id}
                          ?checked=${this.selected}
                          @change=${(ev:Event) => this.selectionChanged(ev)}/>${node.item.title}
                  </div>
              </summary>
              <ul>
              ${node.children.map((child) => html`<tree-item .data=${child}></tree-item>`)}
              </ul>
          </details>
      </li>`;
    } else {
        return html`
            <li class="non-details">
                <div class="summary-row">
                    <input id="input" type="checkbox"
                        value=${node.item.id}

                        ?checked=${this.selected}
                        @change=${(ev:Event) => this.selectionChanged(ev)}/>${node.item.title}</div>
            </li>`;
    }
  }
  render() {
    return html`${this.renderTemplate(this.data)}`;
  }
}
// ?selected=${this.selected}
