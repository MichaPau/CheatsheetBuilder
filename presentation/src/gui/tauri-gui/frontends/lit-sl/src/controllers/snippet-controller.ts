import { ReactiveController, ReactiveControllerHost } from "lit";
import { SnippetContainer } from "../components/snippet";

import { invoke } from "@tauri-apps/api/core";

export class SnippetController implements ReactiveController {
  private host: SnippetContainer;

  constructor(host: ReactiveControllerHost & SnippetContainer) {
    this.host = host;
    this.host.addController(this);
  }

  hostConnected(): void {}

  hostDisconnected(): void {}

}
