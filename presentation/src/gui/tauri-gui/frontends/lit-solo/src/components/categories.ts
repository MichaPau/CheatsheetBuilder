import { html, css, LitElement } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';

//import './category_node.js';
import mainStyles from '../styles/mainStyle.js';

import { TreeCategory} from '../types.js';

@customElement('category-tree')
export class Categories extends LitElement {
  static styles = [
    mainStyles,
    css `
      :host {
        display: block;
      }
    `
  ];

  @state()
  state_var = false;

  @property({type: Array})
  category_tree: Array<TreeCategory> = [];

  connectedCallback(): void {
    super.connectedCallback();
    console.log("connectedCallback");
  }

  renderTemplate(node: TreeCategory): any {

    return html`
    <sl-tree-item>
        ${node.item.title}
        ${node.children.map((child) => 
            this.renderTemplate(child)
        )}
        
    </sl-tree-item>`;
}


  render() {
    return html`
        <sl-tree selection="multiple">
            ${this.category_tree.map((node) => {
                return this.renderTemplate(node);
            }
                
            )}
        </sl-tree>
    `;
  }
}