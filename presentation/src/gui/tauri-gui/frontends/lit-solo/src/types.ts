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

export type TreeCategory = {
    item: Tag,
    selected: boolean | undefined,
    open: boolean | undefined,
    children: Array<TreeCategory>
};

declare global {
  interface HTMLElementEventMap {
    'update-parent-category': CustomEvent<{tag_id: number, new_parent_id: number}>;
  }
}
