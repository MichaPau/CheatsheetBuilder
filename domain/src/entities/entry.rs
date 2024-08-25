
use crate::{entities::errors::CheatsheetError, utils::types::Timestamp as TimestampImpl};

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
    pub fn new(id: SnippetID, title: String, text: String, tags: Vec<TagID>) -> Self {
        Self {
            id,
            title,
            text,
            tags,
            created_at: Timestamp::from_utc_now(),
            updated_at: Timestamp::from_utc_now(),
        }
    }
}
#[derive(Debug)]
pub struct CreateSnippet {
    pub title: String, 
    pub text: String,
    pub tags: Vec<TagID>,
}

impl CreateSnippet {
    pub fn new(title: String, text: String, mut tags: Vec<TagID>) -> Result<Self, CheatsheetError> {
        
        if tags.len() == 0 {
            tags.push(0);
        }
        Ok( Self {
            title,
            text,
            tags
        })
    }
}

#[derive(Debug, Clone)]
pub struct CreateTag {
    pub title: String,
    pub tag_type: TagType,
    pub parent: Option<TagID>,
}

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Tag {
    pub id: TagID,
    pub title: String,
    pub parent: Option<TagID>,
    pub tag_type: TagType,
}


#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum TagType {
    Normal,
    Untagged,
    Category,
}








