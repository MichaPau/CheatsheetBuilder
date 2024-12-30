import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import sharedStyles from '../styles/shared-styles.js';
import { TreeCategory } from '../types.js';


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

      details summary::before {
          content: "-";
      }

      details[open] > summary::before {
          content: "|";
      }
      summary {
        cursor: pointer;
        list-style: none;
      }

      .non-details {
          &:before {content: "|";}
      }
      #root-item {
          --spacing: 0.5rem;
          --radius: 0px;

          &:first-child {
              margin: 0;
              padding-left: 0;
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

  @property({type: Array})
  category_tree: Array<TreeCategory> = [];

  connectedCallback(): void {
    super.connectedCallback();
  }

  renderTemplate(node: TreeCategory): any {

    if (node.children.length > 0) {
      return html`
      <li>
          <details ?open=${node.open}>
              <summary><input type="checkbox" ?selected=${node.selected} />${node.item.title}</summary>
              ${node.children.map((child) => html`<ul>${this.renderTemplate(child)}</ul>`)}
          </details>
      </li>`;
    } else {
        return html`<li class="non-details"><input type="checkbox" ?selected=${node.selected} />${node.item.title}</li>`;
    }
  }
  render() {
    return html`
        <ul id="root-item">
            <li>
                <details open>
                    <summary><input type="checkbox"/>Root</summary>
                    ${this.category_tree.map((child) => html`<ul>${this.renderTemplate(child)}</ul>`)}
                </details>
            </li>
        </ul>
    `;
  }
}
