export type Tag = { 
    id: number, 
    title: string, 
    parent_id: number | null, 
    tag_type: string, 
    tag_style: object | null
};

export type Snippet = {
    id: number,
    title: string,
    text: string,
    tags: Array<Tag>,
    created_at: number,
    updated_at: number,
}

export type TreeCategory = { item: Tag; children: Array<TreeCategory> };

