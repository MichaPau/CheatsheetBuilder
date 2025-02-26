export class TestVanillaComp extends HTMLElement {

  timeout(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }
  test_event = async (ev: Event) => {

    console.log("TestVanillaComp::test_event");
    ev.stopPropagation();
    ev.stopImmediatePropagation();

    console.log("srcElement:", ev.srcElement);
    console.log("target:", ev.target);
    console.log("path[0]", ev.composedPath()[0]);

    await this.timeout(500);

    console.log("srcElement:", ev.srcElement);
    console.log("target:", ev.target);
    console.log("path[0]", ev.composedPath()[0]);
  }
  // connect component
  connectedCallback() {
    //const shadow = this.attachShadow({ mode: 'closed'});
    const btn = document.createElement("button");
    btn.innerText = "Test Std Event";
    //shadow.appendChild(btn);
    this.appendChild(btn);

    btn.addEventListener("click", this.test_event);

  }

}

customElements.define( 'test-vanilla-comp', TestVanillaComp );
