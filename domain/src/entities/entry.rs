
use crate::utils::types::Timestamp as TimestampImpl;

pub type SnippetID = usize;
pub type TagID = usize;

pub type SnippetList = Vec<Snippet>;
pub type TagList = Vec<Tag>;

pub type Timestamp = TimestampImpl;
pub type TagColor = u32;

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Snippet {
    pub id: SnippetID,
    pub title: String,
    pub text: String,
    pub tags: Vec<Tag>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

impl Snippet {
    pub fn new(id: SnippetID, title: String, text: String, tags: Vec<Tag>, created_at: Timestamp) -> Self {
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
    pub tags: Vec<Tag>,
}

impl CreateSnippet {
    pub fn new(title: String, text: String, tags: Vec<Tag>) -> Self {
        
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
    pub tag_style: Option<TagStyle>,
}

impl Default for CreateTag {
    fn default() -> Self {
        Self {
            title: "".into(),
            tag_type: TagType::Normal,
            parent_id: None,
            tag_style: None,
        }
    }
}
#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Tag {
    pub id: TagID,
    pub title: String,
    pub parent_id: Option<TagID>,
    pub tag_type: TagType,
    pub tag_style: Option<TagStyle>,
}


#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[non_exhaustive]
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
            _ => TagType::Normal,
        }
    }
}

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Color {
    RGB((u8, u8, u8)),
    Decimal(u32),
}
#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct TagStyle {
    pub color: Color,
}

impl Into<u32> for Color {
    fn into(self) -> u32 {
        match self {
            Color::RGB((r, g, b)) => {
                let c: u32 = ((r as u32) << 16) + ((g as u32) << 8) + (b as u32);
                c
            },
            Color::Decimal(v) => v,
        }
    }
}

#[test]
fn tag_styles() {
    let style = TagStyle {
        color: Color::RGB((255, 255, 255)),
    };
    let style2 = TagStyle {
        color: Color::Decimal(16777215),
    };
    let v1:u32 = style.color.into();
    let v2:u32 = style2.color.into();

    assert_eq!(v1, v2);
}








