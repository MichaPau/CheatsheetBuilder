use domain::entities::entry::{CreateSnippet, CreateTag, Snippet, SnippetID, SnippetList, Tag, TagID, TagList, TagType, Timestamp};

use crate::errors::CheatsheetError;

use super::stores::{SnippetStore, TagStore};

pub struct Service<R> where R: SnippetStore + TagStore + Send + Sync + Clone + 'static {
    pub store: R,
}

impl <R> Service<R> where R: SnippetStore + TagStore + Send + Sync + Clone + 'static{
    pub fn new(store: R) -> Self {
        Self {
            store,
        }
    }

    pub fn get_entry(&self, id: SnippetID) -> Result<Snippet, CheatsheetError> {
        self.store.get_entry(id)
    }
    //snippet store
    pub fn add_entry(&mut self, entry: CreateSnippet) -> Result<Snippet, CheatsheetError> {
        self.store.add_entry(entry)
    }
    pub fn update_text(&self, id: SnippetID, new_text: String) -> Result<bool, CheatsheetError> {
        self.store.update_text(id, new_text)
    }
    pub fn delete_entry(&self, id: SnippetID) -> Result<Snippet, CheatsheetError> {
        self.store.delete_entry(id)
    }
    pub fn add_tags(&mut self, snippet_id: SnippetID, tags: Vec<Tag>) -> Result<usize, CheatsheetError> {
        self.store.add_tags(snippet_id, tags)
    }
    pub fn remove_tag(&self, snippet_id: SnippetID, tag_id:TagID) -> Result<bool, CheatsheetError> {
        self.store.remove_tag(snippet_id, tag_id)
    }
    pub fn get_snippet_list(&self, tag_filter: Option<Vec<TagID>>, time_boundry: Option<(Timestamp, Timestamp)>) -> Result<SnippetList, CheatsheetError> {
        self.store.get_snippet_list(tag_filter, time_boundry)
    }

    //tags
    pub fn add_tag(&self, tag: CreateTag) -> Result<Tag, CheatsheetError> {
        self.store.add_tag(tag)
    }
    pub fn get_tag(&self, id: TagID) -> Result<Tag, CheatsheetError> {
        self.store.get_tag(id)
    }
    pub fn update_tag_title(&self, id: TagID, new_title: String) -> Result<bool, CheatsheetError> {
        self.store.update_tag_title(id, new_title)
    }
    pub fn update_tag_parent(&self, id: TagID, new_parent_id: Option<TagID>) -> Result<bool, CheatsheetError> {
        self.store.update_tag_parent(id, new_parent_id)
    }
    pub fn update_tag_type(&self, tag_id: TagID, new_type: TagType) -> Result<bool, CheatsheetError> {
        self.store.update_tag_type(tag_id, new_type)
    }
    pub fn delete_tag(&self, tag_id: TagID) -> Result<Tag, CheatsheetError> {
        self.store.remove_tag_from_all(tag_id)?;
        let deleted_tag = self.store.delete_tag(tag_id)?;
        Ok(deleted_tag)
    }

    pub fn get_tag_list(&self) -> Result<TagList, CheatsheetError> {
        self.store.get_tag_list()
    }
    pub fn get_tag_hierarchy(&self, tag_id: TagID) -> Result<Vec<Tag>, CheatsheetError> {
        self.store.get_tag_hierarchy(tag_id)
    }
    
}