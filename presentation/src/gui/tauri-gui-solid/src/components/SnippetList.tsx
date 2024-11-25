import { createStore } from "solid-js/store";
import { Snippet, Tag } from "../types";
import { createEffect, For } from "solid-js";

export function SnippetList(props: { data: Array<Snippet> }) {
    const [data, setData] = createStore([] as Snippet[]);

    createEffect(() => {
        setData(props.data);
    });

    return (
        <>
        <div class="snippet-container">
            <For each={data}>
                {(item: Snippet) => (
                    <sl-card class="snippet-item">
                        <div slot="header">
                            {item.title}
                        </div>
                        <div slot="footer">
                            <For each={item.tags}>
                                {(tag: Tag) => (
                                    <>{tag.title}</>
                                )}
                            </For>
                        </div>
                        {item.text}
                    </sl-card>
                )}
            </For>
        </div>
        </>
    );
}