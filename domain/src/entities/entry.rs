use core::fmt;
use std::ops::{Deref, DerefMut};

use crate::utils::types::Timestamp as TimestampImpl;

pub type SnippetID = usize;
pub type TagID = usize;

pub type SnippetList = Vec<Snippet>;
pub type TagList2 = Vec<Tag>;

pub type Timestamp = TimestampImpl;
pub type TagColor = u32;

#[cfg(feature = "serde")]
use serde::Serialize;

#[derive(Debug)]
#[cfg_attr(feature = "serde", derive(Serialize))]
pub struct TagList {
    pub inner: Vec<Tag>,
}

impl Deref for TagList {
    type Target = Vec<Tag>;
    fn deref(&self) -> &Self::Target {
        &self.inner
    }
}

impl DerefMut for TagList {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.inner
    }
}

impl From<Vec<Tag>> for TagList {
    fn from(value: Vec<Tag>) -> Self {
        TagList { inner: value }
    }
}

impl FromIterator<Tag> for TagList {
    fn from_iter<T: IntoIterator<Item = Tag>>(iter: T) -> Self {
        let mut c = TagList { inner: vec![] };

        for i in iter {
            c.inner.push(i)
        }

        c
    }
}
impl TagList {
    pub fn get_child_tags(&self, id: Option<TagID>) -> Self {
        let childs: TagList = self
            .inner
            .iter()
            .cloned()
            .filter(|item| item.parent_id == id)
            .collect();
        childs
    }
}

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[cfg_attr(feature = "serde", derive(Serialize))]
pub struct Snippet {
    pub id: SnippetID,
    pub title: String,
    pub text: String,
    pub text_type: TextType,
    pub tags: Vec<Tag>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

impl Snippet {
    pub fn new(
        id: SnippetID,
        title: String,
        text: String,
        text_type: TextType,
        tags: Vec<Tag>,
        created_at: Timestamp,
    ) -> Self {
        Self {
            id,
            title,
            text,
            text_type,
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
    pub text_type: TextType,
}

impl Default for CreateSnippet {
    fn default() -> Self {
        Self {
            title: "".into(),
            text: "".into(),
            tags: vec![],
            text_type: TextType::Markdown,
        }
    }
}
impl CreateSnippet {
    pub fn new(title: String, text: String, text_type: TextType, tags: Vec<Tag>) -> Self {
        Self {
            title,
            text,
            text_type,
            tags,
        }
    }
}
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[non_exhaustive]
#[cfg_attr(feature = "serde", derive(Serialize))]
pub enum TextType {
    Text = 0,
    Markdown = 1,
}

impl From<usize> for TextType {
    fn from(value: usize) -> Self {
        match value {
            0 => TextType::Text,
            1 => TextType::Markdown,
            _ => TextType::Text,
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
#[cfg_attr(feature = "serde", derive(Serialize))]
//#[serde(tag = "type")]
pub struct Tag {
    pub id: TagID,
    pub title: String,
    pub parent_id: Option<TagID>,
    pub tag_type: TagType,
    pub tag_style: Option<TagStyle>,
}

impl fmt::Display for Tag {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.title)
    }
}

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[cfg_attr(feature = "serde", derive(Serialize))]
pub struct Cheatsheet {
    pub id: usize,
    pub title: String,
    pub snippets: Vec<CheatsheetItem>,
}

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[cfg_attr(feature = "serde", derive(Serialize))]
pub struct CheatsheetItem {
    pub id: usize,
    pub order: usize,
    pub snippet: Snippet,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[cfg_attr(feature = "serde", derive(Serialize))]
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
#[cfg_attr(feature = "serde", derive(Serialize))]
pub enum Color {
    RGB((u8, u8, u8)),
    Decimal(u32),
}
#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[cfg_attr(feature = "serde", derive(Serialize))]
pub struct TagStyle {
    pub color: Color,
}

impl Into<u32> for Color {
    fn into(self) -> u32 {
        match self {
            Color::RGB((r, g, b)) => {
                let c: u32 = ((r as u32) << 16) + ((g as u32) << 8) + (b as u32);
                c
            }
            Color::Decimal(v) => v,
        }
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[cfg_attr(feature = "serde", derive(Serialize))]
#[non_exhaustive]
pub enum SearchMode {
    Start,
    Contains,
}
#[test]
fn tag_styles() {
    let style = TagStyle {
        color: Color::RGB((255, 255, 255)),
    };
    let style2 = TagStyle {
        color: Color::Decimal(16777215),
    };
    let v1: u32 = style.color.into();
    let v2: u32 = style2.color.into();

    assert_eq!(v1, v2);
}
