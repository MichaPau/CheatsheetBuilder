import { createSignal, For, onMount } from "solid-js";

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tree/tree.js';
import '@shoelace-style/shoelace/dist/components/tree-item/tree-item.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';

import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import "./components/Categories"
import { Categories } from "./components/Categories";
import { Tag, Snippet } from "./types";
import { SnippetList } from "./components/SnippetList";



function App() {
  
  //const [name, setName] = createSignal("");
  const [categories, setCategories] = createSignal([] as Array<Tag>);
  const [snippets, setSnippets] = createSignal([] as Array<Snippet> )

  let containerRef:HTMLDivElement | undefined;
  //addEventListener("test_event", (e: CustomEvent) => console.log(e.detail));

  onMount(async () => {
    console.log("onMount");
    let cats: Array<Tag> = await invoke("get_categories").catch(err => console.log(err)) as Array<Tag>;
    let snippets: Array<Snippet> = await invoke("get_snippets").catch(err => console.log(err)) as Array<Snippet>;
    setCategories(cats);
    setSnippets(snippets);
    if(containerRef) {
      console.log("add listener");
      containerRef.addEventListener("test_event", (e: Event) => console.log("custom event", (e as CustomEvent).detail));
    }
      


    //console.log("categories: ", cats);
  });


  function testHandler(_e:Event) {
    console.log("TestHandler");
  }
  function onTestClick(_e:Event) {
    console.log("click Test button");
    var htmlElement = document.querySelector("html");
    if (htmlElement?.classList.contains("sl-theme-dark")) {
      htmlElement.classList.remove("sl-theme-dark");
    } else {
      htmlElement?.classList.add("sl-theme-dark");
    }
  }

  return (
    <div id="app-container" ref={containerRef}>
      <header class="header">
          <input type="button" on:click={onTestClick} value="Test"/>
          <sl-button on:click={onTestClick}>Test</sl-button>
      </header>
      <aside class="sidebar">
        <Categories data={categories()}/>
      </aside>
      <main class="main-content">
        <SnippetList data={snippets()}/>
      </main>
      <footer class="footer">Footer</footer>
    </div>
  );
}

export default App;
