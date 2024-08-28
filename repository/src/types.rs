use domain::entities::entry::Tag;

pub struct TagListItem {
    pub tag: Tag,
    pub childs: Vec<Tag>,
}