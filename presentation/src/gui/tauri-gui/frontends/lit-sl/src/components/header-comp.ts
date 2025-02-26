import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import sharedStyles from '../styles/shared-styles.js';
import { Order, SearchOrder } from '../types.js';
import './search-order-button.js';
import { appSettingContext, AppSettings } from '../utils/app-context.js';
import { consume } from '@lit/context';
import { SearchOrderButton } from './search-order-button.js';

@customElement('header-comp')
export class HeaderComp extends LitElement {
  static styles = [
    sharedStyles,
    css `
      :host {
        display: block;
      }

      #search-button-container {
          display: flex;

          gap: var(--spacing-small);
      }
    `
  ];

  @consume({ context: appSettingContext, subscribe: true })
  @state()
  appSettings!: AppSettings;

  @state()
  state_var = false;

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("swap-search-order", this.swapOrder);
    this.addEventListener("search-value-updated", this.searchValueUpdated);
  }
  searchValueUpdated(_ev: Event) {
    const container = this.shadowRoot!.getElementById("search-button-container");
    let childs = Array.from(container!.children!);
    let orderSettings: Array<SearchOrder> = [];
    for(const c of childs) {
      orderSettings.push((c as SearchOrderButton).getOrder());
      //container?.append(c);
    }
    this.appSettings.save_search_order(orderSettings);
    this.dispatchEvent(new Event("reload_snippets-settings-change", { bubbles: true, composed: true }));
  }
  swapOrder(ev: Event) {
    console.log("swap");
    const cev = ev as CustomEvent;
    const container = this.shadowRoot!.getElementById("search-button-container");
    let childs = Array.from(container!.children!);

    const draggedElem = this.shadowRoot!.getElementById(cev.detail.draggedId)!;
    const targetElem = this.shadowRoot!.getElementById(cev.detail.targetId)!;

    const draggedIndex = childs.indexOf(draggedElem);
    const targetIndex = childs.indexOf(targetElem);

    console.log(draggedIndex, ",", targetIndex);
    let orderSettings = childs.map(item => (item as SearchOrderButton).getOrder());
    //console.log(orderSettings);
    [orderSettings[draggedIndex], orderSettings[targetIndex]] = [orderSettings[targetIndex], orderSettings[draggedIndex]];
    //console.log(orderSettings);

    // [childs[draggedIndex], childs[targetIndex]] = [childs[targetIndex], childs[draggedIndex]];
    // container?.replaceChildren();

    // let orderSettings: Array<SearchOrder> = [];
    // for(const c of childs) {
    //   orderSettings.push((c as SearchOrderButton).getOrder());
    //   container?.append(c);
    // }
    this.appSettings.save_search_order(orderSettings);
    this.dispatchEvent(new Event("reload_snippets-settings-change", { bubbles: true, composed: true }));

  }
  render() {
    return html`
        <!-- <div id="search-button-container2">
            <search-order-button draggable="true" label="title" value="title" .state=${Order.DESC} id="button_1"></search-order-button>
            <search-order-button draggable="true" label="created" value="createdat" .state=${Order.ASC} id="button_2"></search-order-button>
            <search-order-button draggable="true" label="updated" value="updatedat" .state=${Order.NONE} id="button_3"></search-order-button>
            <search-order-button draggable="true" label="test" value="test" .state=${Order.NONE} id="button_4"></search-order-button>
        </div> -->
        <div id="search-button-container">
            ${this.appSettings.search_order.map((item, index) => {
                const id = "button_" + (index + 1);
                return html`<search-order-button draggable="true" label=${item.title} value=${item.value} .state=${item.order} id=${id}></search-order-button>`;
            })}
        </div>
    `;
  }
}
