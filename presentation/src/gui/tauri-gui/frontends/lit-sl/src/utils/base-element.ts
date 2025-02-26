import { css, CSSResultGroup, LitElement } from "lit";

export class BaseElement extends LitElement {
  static styles =
    css`
      :host {
        display: block;
      }
      :host(.on-error) {
          animation: error-anim 1s ease-in both;
      }
      :host(.on-success) {
          animation: success-anim 1s ease-in both;
      }
      @keyframes error-anim {
          0% {
              box-shadow: 0;
          }
          50% {
              box-shadow: 0px 0px 10px 10px rgba(255, 0, 0, 0.7);
          }
          100% {
              box-shadow: 0;
          }
      }
      @keyframes success-anim {
          0% {
              box-shadow: 0;
          }
          50% {
              box-shadow: 0px 0px 10px 10px rgba(0, 255, 0, 0.7);
          }
          100% {
              box-shadow: 0;
          }
      }
    ` as CSSResultGroup
  ;

  showSuccess() {
    console.log("show success");
    this.addEventListener("animationstart", this.onSuccessStart);
    this.addEventListener("animationend", this.onSuccessEnd);

    this.classList.add("on-success");
  }
  onSuccessStart = (_ev:Event) => {
    console.log("success anim start");
  }
  onSuccessEnd = (_ev:Event) => {
    console.log("success anim stop");
    this.classList.remove("on-success");
    this.removeEventListener("animationstart", this.onSuccessStart);
    this.removeEventListener("animationend", this.onSuccessEnd);
  }

  showError() {
    console.log("show error");
    this.addEventListener("animationstart", this.onErrorStart);
    this.addEventListener("animationend", this.onErrorEnd);

    this.classList.add("on-error");
  }
  onErrorStart = (_ev:Event) => {
    console.log("error anim start");
  }
  onErrorEnd = (_ev:Event) => {

    this.classList.remove("on-error");
    this.removeEventListener("animationstart", this.onErrorStart);
    this.removeEventListener("animationend", this.onErrorEnd);
  }
  constructor() {
    super();
  }
  connectedCallback(): void {
    super.connectedCallback();
  }
}
