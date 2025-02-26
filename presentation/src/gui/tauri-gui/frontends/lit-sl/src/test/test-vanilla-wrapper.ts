import "./test-lit-comp";
import "./test-vanilla-comp";

class TestVanillaWrapper extends HTMLElement {


  // connect component
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed'});
    const c1 = document.createElement("test-lit");
    const c2 = document.createElement("test-vanilla-comp");

    shadow.appendChild(c1);
    shadow.appendChild(c2);

    //this.appendChild(c1);
    //this.appendChild(c2);


  }

}

customElements.define( 'test-vanilla-wrapper', TestVanillaWrapper );
