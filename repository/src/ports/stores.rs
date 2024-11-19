use domain::entities::entry::*;
use domain::utils::types::SearchPattern;

use crate::errors::CheatsheetError;

//use super::services::Service;

pub trait StateTrait: SnippetStore + TagStore + Send + Sync + 'static {}


pub trait SnippetStore {
    fn get_entry(&self, id: SnippetID) -> Result<Snippet, CheatsheetError>;
    fn add_entry(&mut self, entry: CreateSnippet) -> Result<Snippet, CheatsheetError>;
    fn add_tags(&mut self, snippet_id: SnippetID, tags: Vec<Tag>) -> Result<usize, CheatsheetError>;
    fn delete_entry(&self, id: SnippetID) -> Result<Snippet, CheatsheetError>;
    fn remove_tag_from_all(&self, tag_id:TagID) -> Result<usize, CheatsheetError>;
    fn remove_tag(&self, snippet_id: SnippetID, tag_id:TagID) -> Result<bool, CheatsheetError>;
    fn update_text(&self, id: SnippetID, new_text: String) -> Result<bool, CheatsheetError>;
    fn get_snippet_list(&self, tag_filter: Option<Vec<TagID>>, time_boundry: Option<(Timestamp, Timestamp)>) -> Result<SnippetList, CheatsheetError>;
    fn search_by_title(&self, pattern: SearchPattern) -> Result<SnippetList, CheatsheetError>;
    fn search_by_content(&self, pattern: SearchPattern) -> Result<SnippetList, CheatsheetError>;
}

pub trait TagStore {
    fn add_tag(&self, tag: CreateTag) -> Result<Tag, CheatsheetError>;
    fn update_tag_title(&self, id: TagID, new_title: String) -> Result<bool, CheatsheetError>;
    fn update_tag_parent(&self, id: TagID, new_parent_id: Option<TagID>) -> Result<bool, CheatsheetError>;
    fn update_tag_type(&self, tag_id: TagID, new_type: TagType) -> Result<bool, CheatsheetError>;
    fn get_tag(&self, id: TagID) -> Result<Tag, CheatsheetError>;
    fn delete_tag(&self, id: TagID) -> Result<Tag, CheatsheetError>;
    fn get_tag_list(&self, type_filter: Option<TagType>) -> Result<TagList, CheatsheetError>;
    fn get_tag_hierarchy(&self, tag_id: TagID) -> Result<TagList, CheatsheetError>;
    
}


// pub struct Service<R> where R: SnippetStore + TagStore {
//     pub store: R,
// }

// impl <R> Service<R> where R: SnippetStore + TagStore {
//     pub fn new(store: R) -> Self {
//         Self {
//             store,
//         }
//     }

//     pub fn add_entry(&mut self, entry: CreateSnippet) -> Result<Snippet, CheatsheetError> {
//         self.store.add_entry(entry)
//     }

//     pub fn add_tag(&self, tag: CreateTag) -> Result<Tag, CheatsheetError> {
//         self.store.add_tag(tag)
//     }
//     pub fn delete_tag(&self, tag_id: TagID) -> Result<Tag, CheatsheetError> {
//         self.store.remove_tag_from_all(tag_id)?;
//         let deleted_tag = self.store.delete_tag(tag_id)?;
//         Ok(deleted_tag)
//     }

//     pub fn get_tag_list(&self) -> Result<TagList, CheatsheetError> {
//         self.store.get_list()
//     }
//     pub fn get_snippet_list(&self, tag_filter: Option<Vec<TagID>>, time_boundry: Option<(Timestamp, Timestamp)>) -> Result<SnippetList, CheatsheetError> {
//         self.store.get_snippet_list(tag_filter, time_boundry)
//     }
// }