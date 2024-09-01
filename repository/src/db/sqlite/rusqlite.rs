

use std::path::Path;


use domain::{entities::entry::*, utils::types::{SearchPattern, Timestamp}};
use rusqlite::{Connection, OpenFlags, Row};

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

        //db.create_default_tables()?;

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
                updated_at INTEGER NOT NULL
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
    fn get_tag_ids_for_snippet(&self, snippet_id: SnippetID) -> rusqlite::Result<Vec<TagID>> {
        
        let mut stmt = self.conn.prepare("SELECT tag_id FROM Snippet_Tags WHERE snippet_id = ?1 ORDER BY tag_id")?;
        let rows = stmt.query_map([snippet_id], |row| row.get::<usize, usize>(0))?;
        
        let tag_ids: Vec<TagID> = rows.into_iter().map(Result::unwrap).collect();

        Ok(tag_ids)
    }
    pub fn create_snippet_from_row(&self, row: &Row) -> rusqlite::Result<Snippet> {
        let c_time: u64  = row.get(3)?;
        let u_time: u64 = row.get(4).unwrap_or(c_time);
        
        let snippet_id = row.get(0)?;
        Ok(Snippet {
            id: snippet_id,
            title: row.get(1)?,
            text: row.get(2)?,
            tags: self.get_tag_ids_for_snippet(snippet_id)?,
            created_at: Timestamp::from(c_time),
            updated_at: Timestamp::from(u_time),
        })
    }
}
#[allow(unused)]
impl SnippetStore for Rusqlite {
    fn add_entry(&mut self, entry: CreateSnippet) -> Result<Snippet, CheatsheetError> {

        let ts = u64::from(Timestamp::from_utc_now());
        self.conn.execute(
            "INSERT INTO Snippet (title, text, created_at, updated_at) VALUES (?1, ?2, ?3, ?4)",
            (&entry.title, &entry.text, ts, ts)
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
        let mut to_delete = self.conn.query_row(
            "SELECT * FROM Snippets WHERE snippet_id = ?1", 
            [id], |r| {
                self.create_snippet_from_row(r)
            })?;
        
        self.conn.execute(
            "DELETE FROM Snippet WHERE snippet_id = ?1",
            [id]
        )?;
        Ok(to_delete)
        
    }
    fn get_entry(&self, id: SnippetID) -> Result<Snippet, CheatsheetError> {
        let mut snippet = self.conn.query_row(
            "SELECT * FROM Snippet WHERE snippet_id = ?1", 
            [id], |r| {
                self.create_snippet_from_row(r)
            })?;
        Ok(snippet)
    }
    fn update_text(&self, id: SnippetID, new_text: String) -> Result<bool, CheatsheetError> {
        let ts = u64::from(Timestamp::from_utc_now());

        self.conn.execute(
            "UPDATE Snippet SET text = ?1, updated_at = ?2 WHERE snippet_id = ?3",
            (new_text, ts, id)
        )?;

        Ok(true)
        //Err(CheatsheetError::NotImplemented("".into()))
    }

    fn remove_tag_from_all(&self, tag_id:TagID) -> Result<usize, CheatsheetError> {
        Err(CheatsheetError::NotImplemented("".into()))
    }
    fn get_snippet_list(&self, tag_filter: Option<Vec<TagID>>, time_boundry: Option<(Timestamp, Timestamp)>) -> Result<SnippetList, CheatsheetError> {
        
        let mut sql = String::from("SELECT * FROM Snippet");

        let mut tag_filtered = false;
        if let Some(tags) = tag_filter {
            let s = tags.iter().map(|id| id.to_string()).collect::<Vec<String>>().join(",");
            let temp = format!(" WHERE snippet_id IN (SELECT snippet_id FROM Snippet_Tags WHERE tag_id IN ({}))", s);
            sql.push_str(&temp);
            tag_filtered = true;
        }

        if let Some((from, to)) = time_boundry {
            let clause = if tag_filtered { "AND" } else { "WHERE" };
            let temp = format!(" {} updated_at BETWEEN {} AND {}", clause, u64::from(from), u64::from(to));
            sql.push_str(&temp);
        }

        // println!("the query: {}", sql);

        let mut stmt = self.conn.prepare(&sql)?;
        let snippet_iter = stmt.query_map([], |row| {
            
            let snippet_id = row.get(0)?;

            let tag_ids = self.get_tag_ids_for_snippet(snippet_id)?;

            let c_time: u64  = row.get(3)?;
            let u_time: u64 = row.get(4).unwrap_or(c_time);
            Ok(Snippet {
                id: snippet_id,
                title: row.get(1)?,
                text: row.get(2)?,
                tags: tag_ids,
                created_at: Timestamp::from(c_time),
                updated_at: Timestamp::from(u_time),
            })
        })?;

        
        let result: Vec<Snippet> = snippet_iter.flat_map(|s|s).collect();

        Ok(result)
    }

    fn search_by_title(&self, pattern: SearchPattern) -> Result<SnippetList, CheatsheetError> {

        Err(CheatsheetError::NotImplemented("".into()))
    }

    fn search_by_content(&self, pattern: SearchPattern) -> Result<SnippetList, CheatsheetError> {
        Err(CheatsheetError::NotImplemented("".into()))
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
        
        let mut stmt = self.conn.prepare("SELECT * FROM Tag WHERE tag_id = ?")?;
        let mut rows = stmt.query([&id])?;

        if let Some(row) = rows.next()? {
            let type_value: usize = row.get(3)?;
            Ok(
                Tag {
                    id: row.get(0)?,
                    title: row.get(1)?,
                    parent_id: row.get(2)?,
                    tag_type: TagType::from(type_value),
                }
            )
        } else {
            Err(CheatsheetError::StoreError(format!("no tag for tag_id: {id}")))
        }
       
        
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


