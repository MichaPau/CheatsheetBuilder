//import { children } from "solid-js/types/server/reactive.js";
import { Tag } from "../types";
import { createStore } from "solid-js/store";
import { children, createEffect, For, onMount } from "solid-js";
import { SlTreeItem } from "@shoelace-style/shoelace";

type TreeCategory = { item: Tag; children: Array<TreeCategory> };

function buildTreeArray(flatArray: Array<Tag>) {
    // Store references to nodes by their IDs
    const nodeMap = new Map();

    // Store the root nodes of the tree
    const result = [] as Array<TreeCategory>;

    // Create a reference object
    flatArray.forEach((item) => {
        nodeMap.set(item.id, {
            item: item,
            children: [] as Array<TreeCategory>,
        });
        //nodeMap[item.id] = { ...item, children: [] };
    });

    // Build the tree array
    flatArray.forEach((item) => {
        //const node = nodeMap[item.id];
        const node = nodeMap.get(item.id);
        if (item.parent_id !== null) {
            (nodeMap.get(item.parent_id) as TreeCategory).children.push(node);
            //nodeMap[item.parentId].children.push(node);
        } else {
            result.push(node);
        }
    });

    // const _root = { item: {id: 0, title: "root", parent_id: null, tag_type:"Category", tag_style: null}, children: []}; 
    // result.unshift(_root);
    return result;
}

export function Categories(props: { data: Array<Tag> }) {
    //https://www.geeksforgeeks.org/build-tree-array-from-flat-array-in-javascript/
    //build tree structure

    const [data, setData] = createStore([] as TreeCategory[]);

    createEffect(() => {
        let tree = buildTreeArray(props.data);
        setData(tree);
       
    });

    
    
    //console.log(JSON.stringify(data));
    // return (
    //     <>
    //         <div>
    //             <For each={data}>
    //                 {(item: TreeCategory) => <CategoryNode data={item} />}
    //             </For>
    //         </div>
    //     </>
    // );

    return (
        <>
            <CategoryNode data={{item: {id: 0, title: "root", parent_id: null, tag_type:"Category", tag_style: null}, children: []}}/>
            <sl-tree prop:selection="multiple">
                <For each={data}>
                    {(item: TreeCategory) => <CategoryNode data={item} />}
                </For>
            </sl-tree>
        </>
    );
}

//https://discord.com/channels/722131463138705510/1234801221831757875/1234871709228597360
function CategoryNode(props: { data: TreeCategory }) {
    let itemRef: SlTreeItem | undefined;

    onMount(async () => {
        
    });
    const log_event_start = (data: Tag, ev:DragEvent) => {
        ev.stopPropagation();
        ev.dataTransfer?.setData("text/plain", JSON.stringify(data));
        console.log("Start:", data.title, ";", data.id);
    };
    const log_event_over = (_data: Tag, ev:DragEvent) => {
        ev.preventDefault();
    };
    const log_event_drop = (data: Tag,ev: DragEvent) => {
        ev.stopPropagation();
        console.log("Drop on:", data.id, ";", data.title);
        let tag = JSON.parse(ev.dataTransfer?.getData("text/plain")!);
        console.log("Drop from:", tag.id,  ";", tag.title);
        const to_id: number | null = data.id != 0 ? data.id : null;
        let ce = new CustomEvent("test_event", { detail: {from: tag.id, to: to_id}, bubbles: true, composed: true});
        if (itemRef) itemRef.dispatchEvent(ce);
    };

    // return (
    //     <>
    //     <div 
    //         draggable="true"
    //         onDrop={[log_event_drop, props.data.item]}
    //         onDragStart={[log_event_start, props.data.item]} 
    //         onDragOver={[log_event_over, props.data.item]}
    //     > 
            
    //         {props.data.item.title}
           
    //     </div>
    //     </>
    // );
    return (
        <sl-tree-item ref={itemRef}
            draggable="true"
            onDrop={[log_event_drop, props.data.item]}
            onDragStart={[log_event_start, props.data.item]} 
            onDragOver={[log_event_over, props.data.item]}>
            
            {props.data.item.title}
            <For each={props.data.children}>
                {(sub: TreeCategory) => <CategoryNode data={sub} />}
            </For>
        </sl-tree-item>
    );
}
