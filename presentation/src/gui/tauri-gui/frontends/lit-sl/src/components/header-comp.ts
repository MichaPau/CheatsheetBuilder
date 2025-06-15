import { html, css, LitElement, PropertyValues } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';

import sharedStyles from '../styles/shared-styles.js';
import { SearchOrder, Tag, TagListInvoker } from '../types.js';

import { appSettingContext, AppSettings } from '../utils/app-context.js';
import { consume } from '@lit/context';
import { SearchOrderButton } from './search-order-button.js';

import './search-order-button.js';
import './tag-search-bar.js';
import './snippet/snippet-tag-list.js';
// import '../test/track_active_element.js';
import { TagSearchBar } from './tag-search-bar.js';

@customElement('header-comp')
export class HeaderComp extends LitElement {
  static styles = [
    sharedStyles,
    css `
      :host {
        display: block;
      }

      #header-container {
          display: grid;
          width: 100%;
          height: 100%;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(4, 1fr);
          grid-template-areas:
            "input input input"
            "tagsearch tagsearch fields"
            "taglist taglist fields"
            "order order order"
          ;
          

      }
      #order-button-container {
          grid-area: order;
          display: flex;
          align-items: center;
          gap: var(--spacing-small);
      }
      #tag-search-container {
        grid-area: tagsearch;
      }
      #tag-list-container {
        grid-area: taglist;
      }

      #search-fields-container {
        grid-area: fields;
      }

      #search-input-container{
        grid-area: input;
      }
    `
  ];

  @consume({ context: appSettingContext, subscribe: true })
  @state()
  appSettings!: AppSettings;

  @query("#tag-search-bar")
  tagSearchBar!: TagSearchBar;

  @state()
  state_var = false;

  @state()
  tag_id_list!: Array<number>;

  @state()
  tag_list: Array<Tag> = [];


  connectedCallback(): void {
    super.connectedCallback();
    this.tag_id_list = this.appSettings.tag_filter;
    this.addEventListener("swap-search-order", this.swapOrder);
    this.addEventListener("search-value-updated", this.searchValueUpdated);
  }

  protected shouldUpdate(_changedProperties: PropertyValues): boolean {
    if (_changedProperties.has("tag_id_list")) {
      this.loadTagList();
    }
    return super.shouldUpdate(_changedProperties);
  }
  async loadTagList() {
      if (this.tag_id_list.length > 0) {
        await TagListInvoker.getTags(this.tag_id_list, this).then(result => {
          this.tag_list = result;
        });
      } else {
        this.tag_list = [];
      }

  }
  searchValueUpdated(_ev: Event) {
    const container = this.shadowRoot!.getElementById("order-button-container");
    let childs = Array.from(container!.children!);
    let orderSettings: Array<SearchOrder> = [];
    for(const c of childs) {
      orderSettings.push((c as SearchOrderButton).getOrder());
      //container?.append(c);
    }
    this.appSettings.save_search_order(orderSettings);
    this.dispatchEvent(new Event("reload-snippets-settings-change", { bubbles: true, composed: true }));
  }
  swapOrder(ev: Event) {
    const cev = ev as CustomEvent;
    const container = this.shadowRoot!.getElementById("order-button-container");
    let childs = Array.from(container!.children!);

    const draggedElem = this.shadowRoot!.getElementById(cev.detail.draggedId)!;
    const targetElem = this.shadowRoot!.getElementById(cev.detail.targetId)!;

    const draggedIndex = childs.indexOf(draggedElem);
    const targetIndex = childs.indexOf(targetElem);

    console.log(draggedIndex, ",", targetIndex);
    let orderSettings = childs.map(item => (item as SearchOrderButton).getOrder());
    //console.log(orderSettings);
    [orderSettings[draggedIndex], orderSettings[targetIndex]] = [orderSettings[targetIndex], orderSettings[draggedIndex]];

    this.appSettings.save_search_order(orderSettings);
    this.dispatchEvent(new Event("reload-snippets-settings-change", { bubbles: true, composed: true }));

  }

  addTag = (ev: CustomEvent) => {
    const tag: Tag = ev.detail.tag;
    if (this.tag_id_list.findIndex(t => t === tag.id) === -1) {
      this.tag_id_list = [...this.tag_id_list, tag.id];
      this.appSettings.save_tag_filter(this.tag_id_list);
      this.tagSearchBar.clearResult();
      console.log("this.tag_id_list now:", this.tag_id_list);
    }

  }
  removeTag = (ev: CustomEvent) => {
    const tag_id = ev.detail.tag_id;
    const index = this.tag_id_list.findIndex(tag => tag === tag_id);
    if (index !== -1) {
      this.tag_id_list = this.tag_id_list.filter(t => t !== tag_id);
      this.appSettings.save_tag_filter(this.tag_id_list);
    }
  }
  render() {
    return html`
        <div id="header-container">
            <div id="tag-search-container">
                <tag-search-bar id="tag-search-bar" .recurrent-tags=${this.appSettings.tag_filter} .allowNewTags=${false} @add-search-tag=${this.addTag}></tag-search-bar>
            </div>
            <div id="tag-list-container">
                <snippet-tag-list .tag_list=${this.tag_list} @remove-tag-from-snippet=${this.removeTag}></snippet-tag-list>
            </div>
            <div id="search-fields-container">
              <fieldset>
                <legend>Search flags:</legend>
                  <div>
                    <input type="checkbox" id="input_include_categories"/>
                    <label for="input_include_categories">Include Categories</label>
                  </div>
                  <div>
                    <input type="radio" id="input_search_title" name="search_in"/>
                    <label for="input_search_title">Search in titles</label>
                    <input type="radio" id="input_search_text" name="search_in"/>
                    <label for="input_search_text">Search in content</label>
                    <input type="radio" id="input_search_both" name="search_in"/>
                    <label for="input_search_both">Search both</label>
                  </div>
              </fieldset>
            </div>
            <div id="search_input_container">
              <label for="input_search">Search: </label>
              <input type="text" id="input_search"/>
            </div>
            <div id="order-button-container">
                ${this.appSettings.search_order.map((item, index) => {
                    const id = "button_" + (index + 1);
                    return html`<search-order-button draggable="true" label=${item.title} value=${item.value} .state=${item.order} id=${id}></search-order-button>`;
                })}
            </div>
            
        </div>
    `;
  }
}
