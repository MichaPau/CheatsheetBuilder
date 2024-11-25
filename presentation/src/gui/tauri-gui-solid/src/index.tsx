/* @refresh reload */
import { render } from "solid-js/web";

import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/themes/dark.css';


import App from "./App";

render(() => <App />, document.getElementById("root") as HTMLElement);
