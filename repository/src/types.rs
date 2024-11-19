use domain::entities::entry::CreateTag;

use crate::ports::services::Service;

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