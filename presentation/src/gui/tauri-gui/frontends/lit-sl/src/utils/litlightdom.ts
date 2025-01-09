import { LitElement } from "lit";

export class LitElementLightDOM extends LitElement {
  protected createRenderRoot() {
      return this;
    }
}
