

use std::path::Path;

use domain::{entities::{entry::*, errors::CheatsheetError}, ports::ports::CheatsheetStore, utils::types::SearchPattern};
use rusqlite::Connection;

pub struct Rusqlite {
    pub conn: Connection,
}

impl Rusqlite {
    pub fn new<P: AsRef<Path>>(path: P) -> Self {
        let conn = Connection::open(path).unwrap();
        Self {
            conn,
        }
    }
}
#[allow(unused)]
impl CheatsheetStore for Rusqlite {
    fn add_entry(&self, entry: CreateSnippet) -> Result<Snippet, CheatsheetError> {
        let _ = entry;
        Err(CheatsheetError::SnippetError)
    }

    fn delete_entry(&self, id: SnippetID) -> Result<Snippet, CheatsheetError> {
        let _ = id;
        Err(CheatsheetError::NotImplemented("".into()))
    }
    fn get_entry(&self, id: SnippetID) -> Result<Snippet, CheatsheetError> {
        Ok(Snippet::new(id, "".into(), "".into(), vec![]))
            
    }
    fn update_text(&self, id: SnippetID, new_text: String) -> Result<bool, CheatsheetError> {
        let _ = id;
        Err(CheatsheetError::NotImplemented("".into()))
    }

    fn remove_tag_from_all(&self, tag_id:TagID) -> Result<usize, CheatsheetError> {
        Ok(0)
    }
    fn get_list(&self, tag_filter: Option<Vec<TagID>>, time_boundry: Option<(Timestamp, Timestamp)>) -> Result<SnippetList, CheatsheetError> {
        Ok(vec![])
    }

    fn search_by_title(&self, pattern: SearchPattern) -> Result<SnippetList, CheatsheetError> {

        Ok(vec![])
    }

    fn search_by_content(&self, pattern: SearchPattern) -> Result<SnippetList, CheatsheetError> {
        Ok(vec![])
    }

}