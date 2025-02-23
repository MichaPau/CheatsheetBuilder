use domain::entities::entry::CreateTag;

use crate::ports::services::Service;

#[cfg(feature = "serde")]
use serde::{Serialize, Deserialize};

//pub trait StateTrait: SnippetStore + TagStore + Send + Sync + 'static {}
// impl<T> StateTrait for T
//     where T: SnippetStore + TagStore + Send + Sync + 'static {}

// #[derive(Debug)]
// pub struct AppState<R> where R: StateTrait {
//     pub service: Service<R>,
// }
//#[derive(Debug)]
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
