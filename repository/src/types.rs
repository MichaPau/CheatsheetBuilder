use domain::entities::entry::CreateTag;

#[derive(Debug)]
pub struct TagListItem {
    pub tag: CreateTag,
    pub childs: Vec<CreateTag>,
}

impl TagListItem {
    pub fn count_tags(&self) -> usize {
        self.childs.len() + 1
    }
}