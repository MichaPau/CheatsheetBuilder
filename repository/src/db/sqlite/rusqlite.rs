

use std::path::Path;


use domain::{entities::entry::*, utils::types::{SearchPattern, Timestamp}};
use rusqlite::{Connection, OpenFlags};

use crate::{errors::CheatsheetError, ports::ports::{SnippetStore, TagStore}};

pub struct Rusqlite {
    pub conn: Connection,
}

impl Rusqlite {
    pub fn new<P: AsRef<Path>>(path: P) -> rusqlite::Result<Self> {
        let conn = Connection::open(path)?;
        let db = Self {
            conn,
        };

        db.create_default_tables()?;

        Ok(db)
    }

    pub fn open<P: AsRef<Path>>(path: P) -> rusqlite::Result<Self> {
        let conn = Connection::open_with_flags(
            path,
            OpenFlags::SQLITE_OPEN_READ_WRITE
            | OpenFlags::SQLITE_OPEN_URI
            | OpenFlags::SQLITE_OPEN_NO_MUTEX,)?;
        
        let db = Self {
            conn,
        };

        db.create_default_tables()?;

        Ok(db)
    }


    pub fn new_in_memory() -> rusqlite::Result<Self> {
        let conn = Connection::open_in_memory()?;

        let db = Self {
            conn,
        };

        db.create_default_tables()?;
        Ok(db)
    }

    fn create_default_tables(&self) -> rusqlite::Result<bool> {
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS Snippet (
                snippet_id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                text TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                updated_at INTEGER
            )", 
            ()
        )?;

        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS Tag (
                tag_id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                parent_id INTEGER,
                tag_type INTEGER
            )", 
            ()
        )?;

        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS Snippet_Tags (
                id INTEGER PRIMARY KEY,
                snippet_id INTEGER NOT NULL,
                tag_id INTEGER,

                FOREIGN KEY (snippet_id) REFERENCES Snippet (snippet_id),
                FOREIGN KEY (tag_id) REFERENCES Tag (tag_id)
            )", 
            ()
        )?;

        Ok(true)
    }
}
#[allow(unused)]
impl SnippetStore for Rusqlite {
    fn add_entry(&mut self, entry: CreateSnippet) -> Result<Snippet, CheatsheetError> {

        let ts = u64::from(Timestamp::from_utc_now());
        self.conn.execute(
            "INSERT INTO Snippet (title, text, created_at) VALUES (?1, ?2, ?3)",
            (&entry.title, &entry.text, ts)
        )?;

        let snippet_id = self.conn.last_insert_rowid();
        let tx = self.conn.transaction()?;
        {
            let mut stmt = tx.prepare("INSERT INTO Snippet_Tags (snippet_id, tag_id) VALUES (?1, ?2)")?;

            for tag_id in &entry.tags {
                stmt.execute((snippet_id, tag_id))?;
            }
        }
        tx.commit()?;

        Ok(Snippet {
            id: snippet_id as usize,
            title: entry.title,
            text: entry.text,
            tags: entry.tags,
            created_at: ts.into(),
            updated_at: ts.into(),

        })
    }

    fn delete_entry(&self, id: SnippetID) -> Result<Snippet, CheatsheetError> {
        let _ = id;
        Err(CheatsheetError::NotImplemented("".into()))
    }
    fn get_entry(&self, id: SnippetID) -> Result<Snippet, CheatsheetError> {
        Ok(Snippet::new(id, "".into(), "".into(), vec![], Timestamp::from_utc_now()))
            
    }
    fn update_text(&self, id: SnippetID, new_text: String) -> Result<bool, CheatsheetError> {
        let _ = id;
        Err(CheatsheetError::NotImplemented("".into()))
    }

    fn remove_tag_from_all(&self, tag_id:TagID) -> Result<usize, CheatsheetError> {
        Ok(0)
    }
    fn get_snippet_list(&self, tag_filter: Option<Vec<TagID>>, time_boundry: Option<(Timestamp, Timestamp)>) -> Result<SnippetList, CheatsheetError> {
        
        let mut stmt = self.conn.prepare("SELECT * FROM Snippet")?;
        let snippet_iter = stmt.query_map([], |row| {
            
            let c_time: u64  = row.get(3)?;
            let u_time: u64 = row.get(4).unwrap_or(c_time);
            Ok(Snippet {
                id: row.get(0)?,
                title: row.get(1)?,
                text: row.get(2)?,
                tags: vec![],
                created_at: Timestamp::from(c_time),
                updated_at: Timestamp::from(u_time),
            })
        })?;

        
        let result: Vec<Snippet> = snippet_iter.flat_map(|s|s).collect();

        Ok(result)
    }

    fn search_by_title(&self, pattern: SearchPattern) -> Result<SnippetList, CheatsheetError> {

        Ok(vec![])
    }

    fn search_by_content(&self, pattern: SearchPattern) -> Result<SnippetList, CheatsheetError> {
        Ok(vec![])
    }

}

#[allow(unused)]
impl TagStore for Rusqlite {
    fn add_tag(&self, tag: CreateTag) -> Result<Tag, CheatsheetError> {
        
        self.conn.execute(
            "INSERT INTO Tag (title, parent_id, tag_type) VALUES (?1, ?2, ?3)",
            (&tag.title, tag.parent_id, tag.tag_type as u32)
        )?;

        let tag_id = self.conn.last_insert_rowid();

        Ok(
            Tag {
                id: tag_id as usize,
                title: tag.title,
                parent_id: tag.parent_id,
                tag_type: tag.tag_type,

            }
        )
        // Err(CheatsheetError::NotImplemented("add_tag not implemented".into()))
    }

    fn delete_tag(&self, id: TagID) -> Result<Tag, CheatsheetError> {
        Err(CheatsheetError::NotImplemented("delete_tag not implemented".into()))
        
    }
    fn get_tag(&self, id: TagID) -> Result<Tag, CheatsheetError> {
        Err(CheatsheetError::NotImplemented("get_tag not implemented".into()))
        
    }
    fn update_parent(&self, id: TagID, new_parent_id: Option<TagID>) -> Result<bool, CheatsheetError> {
        Err(CheatsheetError::NotImplemented("update_parent not implemented".into()))
        
    }
    fn update_title(&self, id: TagID, new_title: String) -> Result<bool, CheatsheetError> {
        Err(CheatsheetError::NotImplemented("update_title implemented".into()))
    }

    fn get_list(&self) -> Result<TagList, CheatsheetError> {

        let mut stmt = self.conn.prepare("SELECT * FROM Tag")?;
        let tag_iter = stmt.query_map([], |row| {
            println!("{:?}", row);
            let type_value: usize = row.get(3)?;
            Ok(
                Tag {
                    id: row.get(0)?,
                    title: row.get(1)?,
                    parent_id: row.get::<usize, Option<usize>>(2)?,
                    tag_type: TagType::from(type_value),
                
                }
            )
        })?;

        let result: Vec<Tag> = tag_iter.flat_map(|s|s).collect();
        Ok(result)
    }
    
}
impl From<rusqlite::Error> for CheatsheetError {
    fn from(err: rusqlite::Error) -> Self {
        CheatsheetError::StoreError(err.to_string())
    }
}