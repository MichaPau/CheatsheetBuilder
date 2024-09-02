use std::{cell::RefCell, collections::HashMap};

use domain::{
    entities::entry::*,
    
    utils::types::SearchPattern,
    
};

use crate::{errors::CheatsheetError, ports::stores::{SnippetStore, TagStore}};



#[derive(Debug)]
pub struct HashMapStore {
    pub snippet_store: RefCell<HashMap<SnippetID, Snippet>>,
    pub tag_store: RefCell<HashMap<TagID, Tag>>,
}

impl HashMapStore {
    pub fn new() -> Self {
        Self::default()
    }

    // pub fn new_from_joplin_export<P: AsRef<Path>>(p: P) -> Self {
    //     tools::parse_joplin::_parse_joplin_export(p.as_ref().to_str().unwrap());
    //     Self::default()
    // }
}

impl Default for HashMapStore {
    fn default() -> Self {
        Self {
            snippet_store: RefCell::new(HashMap::new()),
            tag_store: RefCell::new(HashMap::new()),
        }
    }
}
impl SnippetStore for HashMapStore {
    fn add_entry(&mut self, snippet: CreateSnippet) -> Result<Snippet, CheatsheetError> {
        let new_key: TagID = match self.snippet_store.borrow().keys().max() {
            Some(max_value) => *max_value+1,
            None => 0,
        };

        let new_snippet = Snippet::new(new_key, snippet.title, snippet.text, snippet.tags, Timestamp::from_utc_now());
        
        self.snippet_store.borrow_mut().insert(new_key, new_snippet.clone());

        Ok(new_snippet)
    }

    fn delete_entry(&self, id: SnippetID) -> Result<Snippet, CheatsheetError> {
        match self.snippet_store.borrow_mut().remove(&id) {
            Some(removed_snippet) => Ok(removed_snippet),
            None => Err(CheatsheetError::SnippetError),
        }
    }

    fn get_entry(&self, id: SnippetID) -> Result<Snippet, CheatsheetError> {
        match self.snippet_store.borrow().get(&id).cloned() {
            Some(snippet) => Ok(snippet),
            None => Err(CheatsheetError::SnippetError)
        }
       
    }

    fn update_text(&self, id: SnippetID, new_text: String) -> Result<bool, CheatsheetError> {
        match self.snippet_store.borrow_mut().get_mut(&id) {
            Some(snippet) => {
                snippet.text = new_text;
                Ok(true)
            },
            None => Err(CheatsheetError::SnippetError)
        }
    }

    fn remove_tag_from_all(&self, tag_id:TagID) -> Result<usize, CheatsheetError> {
        let mut store = self.snippet_store.borrow_mut();
        let mut remove_count = 0;
        for (_, value) in store.iter_mut() {
            let c1 = value.tags.len();
            value.tags.retain(|tag| tag.id != tag_id);

            if c1 > value.tags.len() {
                remove_count += 1;
            }
        }
        Ok(remove_count)
    }
    fn get_snippet_list(&self, tag_filter: Option<Vec<TagID>>, time_boundry: Option<(Timestamp, Timestamp)>) -> Result<SnippetList, CheatsheetError> {
        
        let list: SnippetList = self.snippet_store.borrow().values().map(|item| item.to_owned()).collect();

        let filtered_list: SnippetList = list.into_iter().filter(|entry| {
            let tag_flag;
            let time_flag;

            if let Some(tags) = &tag_filter {
                tag_flag = entry.tags.iter().any(|item| tags.contains(&item.id));
                //println!("{:?} - {:?} - {}", entry.tags, tags, tag_flag);
                // tag_flag = entry.tags.iter().an
            } else {
                tag_flag = true;
            }
            if let Some(time_boundry) = &time_boundry {
                time_flag = entry.created_at > time_boundry.0 && entry.created_at < time_boundry.1;
            } else {
                time_flag = true;
            }
            
            //println!("tag flag: {} - time_flag: {} - all: {}", tag_flag, time_flag, tag_flag && time_flag);
            tag_flag && time_flag


        }).collect();

        // if let Some(tag_filter) = tag_filter {
        //     list = list
        //         .into_iter()
        //         .filter(|entry| entry.tags.iter().all(|item| tag_filter.contains(item)))
        //         //.map(|item| item.to_owned())
        //         .collect();
        // }

        // if let Some(time_boundry) = time_boundry {
        //     list = list
        //         .into_iter()
        //         .filter(|entry| entry.created_at > time_boundry.0 && entry.created_at < time_boundry.1)
        //         .collect()
        // } 
        
        
        Ok(filtered_list)
    }

    fn search_by_title<>(&self, pattern: SearchPattern) -> Result<SnippetList, CheatsheetError> {
        let _ = pattern;
        Err(CheatsheetError::NotImplemented("".into()))
    }

    fn search_by_content<>(&self, pattern: SearchPattern) -> Result<SnippetList, CheatsheetError> {
        let _ = pattern;
        Err(CheatsheetError::NotImplemented("".into()))
    }
}

impl TagStore for HashMapStore {
    fn add_tag(&self, tag: CreateTag) -> Result<Tag, CheatsheetError> {
        let new_key: TagID = match self.tag_store.borrow().keys().max() {
            Some(max_value) => *max_value+1,
            None => 1,
        };

        let new_tag = Tag {
            id: new_key,
            title: tag.title,
            parent_id: tag.parent_id,
            tag_type: tag.tag_type,
            tag_style: tag.tag_style,

        };

        
        self.tag_store.borrow_mut().insert(new_key, new_tag.clone());

        Ok(new_tag)
    }

    fn get_tag(&self, id: TagID) -> Result<Tag, CheatsheetError> {
        let _ = id;
        Err(CheatsheetError::NotImplemented("HashmapStore::get_tag not implemented".into()))
    }
    fn update_parent(&self, id: TagID, new_parent_id: Option<TagID>) -> Result<bool, CheatsheetError> {
        match self.tag_store.borrow_mut().get_mut(&id) {
            Some(entry) => {
                entry.parent_id = new_parent_id;
                Ok(true)
            },
            None => Ok(false)
        }
    }
    fn update_title(&self, id: TagID, new_title: String) -> Result<bool, CheatsheetError> {
        match self.tag_store.borrow_mut().get_mut(&id) {
            Some(entry) => {
                entry.title = new_title;
                Ok(true)
            },
            None => Ok(false)
        }
       
    }

    fn delete_tag(&self, id: TagID) -> Result<Tag, CheatsheetError> {
        match self.tag_store.borrow_mut().remove(&id) {
            Some(removed_tag) => Ok(removed_tag),
            None => Err(CheatsheetError::TagError),
        }
        
    }
    fn get_list(&self) -> Result<TagList, CheatsheetError> {
        Err(CheatsheetError::NotImplemented("get_list not implelented".into()))

    }

    
}

impl HashMapStore {
    fn _print_stores(&self) {
        println!("{:#?}", self.snippet_store);
        println!("{:#?}", self.tag_store);

    }
}

