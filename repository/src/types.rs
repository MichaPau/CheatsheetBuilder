use domain::entities::entry::CreateTag;

use crate::ports::services::Service;

#[cfg(feature = "serde")]
use serde::{Deserialize, Serialize};

// #[derive(Debug)]
pub struct AppState {
    pub service: Service,
}

#[derive(Debug, PartialEq)]
#[cfg_attr(feature = "serde", derive(Serialize, Deserialize))]
pub enum OrderDir {
    NONE,
    ASC,
    DESC,
}

impl ToString for OrderDir {
    fn to_string(&self) -> String {
        match &self {
            Self::ASC => "ASC".into(),
            Self::DESC => "DESC".into(),
            _ => "".into(),
        }
    }
}
#[derive(Debug)]
#[cfg_attr(feature = "serde", derive(Serialize, Deserialize))]
pub struct SearchOrder {
    pub column_name: String,
    pub order_dir: u8,
}
impl ToString for SearchOrder {
    fn to_string(&self) -> String {
        match &self.order_dir {
            1 => format!("{} ASC", self.column_name),
            2 => format!("{} DESC", self.column_name),
            _ => "".into(),
        }
    }
}

#[cfg_attr(feature = "serde", derive(Deserialize))]
#[derive(Debug)]
pub struct SearchPattern {
    pub search_type: SearchType,
    pub pattern: String,
}

#[cfg_attr(feature = "serde", derive(Deserialize))]
#[derive(Debug)]
pub enum SearchType {
    StartWith,
    EndWith,
    Contains,
}

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
