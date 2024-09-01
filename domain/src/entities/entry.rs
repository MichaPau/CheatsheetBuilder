
use crate::utils::types::Timestamp as TimestampImpl;

pub type SnippetID = usize;
pub type TagID = usize;

pub type SnippetList = Vec<Snippet>;
pub type TagList = Vec<Tag>;

pub type Timestamp = TimestampImpl;

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Snippet {
    pub id: SnippetID,
    pub title: String,
    pub text: String,
    pub tags: Vec<TagID>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

impl Snippet {
    pub fn new(id: SnippetID, title: String, text: String, tags: Vec<TagID>, created_at: Timestamp) -> Self {
        Self {
            id,
            title,
            text,
            tags,
            created_at: created_at.clone(),
            updated_at: created_at,
        }
    }
}
#[derive(Debug, Clone)]
pub struct CreateSnippet {
    pub title: String, 
    pub text: String,
    pub tags: Vec<TagID>,
}

impl CreateSnippet {
    pub fn new(title: String, text: String, tags: Vec<TagID>) -> Self {
        
        // if tags.len() == 0 {
        //     tags.push(0);
        // }
        Self {
            title,
            text,
            tags
        }
    }
}

#[derive(Debug, Clone)]
pub struct CreateTag {
    pub title: String,
    pub tag_type: TagType,
    pub parent_id: Option<TagID>,
}

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Tag {
    pub id: TagID,
    pub title: String,
    pub parent_id: Option<TagID>,
    pub tag_type: TagType,
}


#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum TagType {
    Untagged = 0,
    Normal = 1,
    Category = 2,
}

impl From<usize> for TagType {
    fn from(value: usize) -> Self {
        match value {
            0 => TagType::Untagged,
            1 => TagType::Normal,
            2 => TagType::Category,
            _ => TagType::Untagged,
        }
    }
}








