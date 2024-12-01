import { Tag, TreeCategory } from "../types";


export function buildTreeArray(flatArray: Array<Tag>) {
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

