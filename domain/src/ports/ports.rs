use crate::entities::entry::*;
use crate::entities::errors::*;
use crate::utils::types::SearchPattern;

pub trait CheatsheetStore {
    fn get_entry(&self, id: SnippetID) -> Result<Snippet, CheatsheetError>;
    fn add_entry(&self, entry: CreateSnippet) -> Result<Snippet, CheatsheetError>;
    fn delete_entry(&self, id: SnippetID) -> Result<Snippet, CheatsheetError>;
    fn remove_tag_from_all(&self, tag_id:TagID) -> Result<usize, CheatsheetError>;
    fn update_text(&self, id: SnippetID, new_text: String) -> Result<bool, CheatsheetError>;
    fn get_list(&self, tag_filter: Option<Vec<TagID>>, time_boundry: Option<(Timestamp, Timestamp)>) -> Result<SnippetList, CheatsheetError>;
    fn search_by_title(&self, pattern: SearchPattern) -> Result<SnippetList, CheatsheetError>;
    fn search_by_content(&self, pattern: SearchPattern) -> Result<SnippetList, CheatsheetError>;
}

pub trait TagStore {
    fn add_tag(&self, tag: CreateTag) -> Result<Tag, CheatsheetError>;
    fn update_title(&self, id: TagID, new_title: String) -> Result<bool, CheatsheetError>;
    fn update_parent(&self, id: TagID, new_parent_id: TagID) -> Result<bool, CheatsheetError>;
    fn get_tag(&self, id: TagID) -> Result<Tag, CheatsheetError>;
    fn delete_tag(&self, id: TagID) -> Result<Tag, CheatsheetError>;
    
}


pub struct Service<R> where R: CheatsheetStore + TagStore {
    pub store: R,
}

impl <R> Service<R> where R: CheatsheetStore + TagStore {
    pub fn new(store: R) -> Self {
        Self {
            store,
        }
    }

    pub fn add_entry(&self, entry: CreateSnippet) -> Result<Snippet, CheatsheetError> {
        self.store.add_entry(entry)
    }

    pub fn add_tag(&self, tag: CreateTag) -> Result<Tag, CheatsheetError> {
        self.store.add_tag(tag)
    }
    pub fn delete_tag(&self, tag_id: TagID) -> Result<bool, CheatsheetError> {
        self.store.remove_tag_from_all(tag_id)?;
        self.store.delete_tag(tag_id)?;
        Ok(true)
    }

    pub fn get_list(&self, tag_filter: Option<Vec<TagID>>, time_boundry: Option<(Timestamp, Timestamp)>) -> Result<SnippetList, CheatsheetError> {
        self.store.get_list(tag_filter, time_boundry)
    }
}