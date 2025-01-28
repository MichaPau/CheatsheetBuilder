use std::{path::Path, sync::Mutex, time};

use domain::{
    entities::entry::*,
    utils::types::{SearchPattern, Timestamp},
};
use rusqlite::{Connection, OpenFlags, Row};

use crate::{
    errors::CheatsheetError,
    ports::stores::{SnippetStore, StateTrait, TagStore}
};

#[derive(Debug)]
pub struct Rusqlite {
    pub conn: Mutex<Connection>,
}

impl Rusqlite {
    pub fn new<P: AsRef<Path>>(path: P) -> rusqlite::Result<Self> {
        let conn = Connection::open(path)?;
        let mut db = Self {
            conn: Mutex::new(conn),
        };

        db.create_default_tables()?;
        db.create_dummy_entries()?;

        Ok(db)
    }

    pub fn open<P: AsRef<Path>>(path: P) -> rusqlite::Result<Self> {
        let conn = Connection::open_with_flags(
            path,
            OpenFlags::SQLITE_OPEN_READ_WRITE
                | OpenFlags::SQLITE_OPEN_URI
                | OpenFlags::SQLITE_OPEN_NO_MUTEX,
        )?;

        let db = Self {
            conn: Mutex::new(conn),
        };

        //db.create_default_tables()?;

        Ok(db)
    }

    pub fn new_in_memory() -> rusqlite::Result<Self> {
        let conn = Connection::open_in_memory_with_flags(
            OpenFlags::SQLITE_OPEN_READ_WRITE
                | OpenFlags::SQLITE_OPEN_URI
                | OpenFlags::SQLITE_OPEN_NO_MUTEX,
        )?;

        let mut db = Self {
            conn: Mutex::new(conn),
        };

        db.create_default_tables()?;
        db.create_dummy_entries()?;
        Ok(db)
    }
    pub fn backup<P: AsRef<Path>>(&self, dst: P) -> rusqlite::Result<()> {
        let c = self.conn.try_lock().unwrap();
        let mut dst = Connection::open(dst).unwrap();
        let backup = rusqlite::backup::Backup::new(&c, &mut dst).unwrap();
        let r = backup.run_to_completion(5, time::Duration::from_millis(250), None);

        r
    }
    pub fn create_dummy_entries(&mut self) -> rusqlite::Result<bool> {
        self.conn
            .lock()
            .unwrap()
            .execute_batch(include_str!("./sql/insert_test_data.sql"))?;
        Ok(true)

    }
    fn create_default_tables(&self) -> rusqlite::Result<bool> {
        self.conn
            .lock()
            .unwrap()
            .execute_batch(include_str!("./sql/create_db.sql"))?;
        Ok(true)
    }



    #[allow(dead_code)]
    fn get_tag_ids_for_snippet(
        &self,
        snippet_id: SnippetID,
        conn: &Connection,
    ) -> rusqlite::Result<Vec<TagID>> {
        //let c = self.conn.try_lock().unwrap();
        let mut stmt =
            conn.prepare("SELECT tag_id FROM Snippet_Tags WHERE snippet_id = ?1 ORDER BY tag_id")?;
        let rows = stmt.query_map([snippet_id], |row| row.get::<usize, usize>(0))?;

        let tag_ids: Vec<TagID> = rows.into_iter().map(Result::unwrap).collect();

        //std::mem::drop(c);
        Ok(tag_ids)
    }

    fn get_tags_for_snippet(
        &self,
        snippet_id: SnippetID,
        conn: &Connection,
    ) -> rusqlite::Result<Vec<Tag>> {
        //let c = self.conn.try_lock().unwrap();

        let mut stmt = conn.prepare("SELECT * FROM Tag INNER JOIN Snippet_Tags ON Snippet_Tags.snippet_id = ?1 AND Tag.tag_id = Snippet_Tags.tag_id ORDER BY tag_id")?;
        let tag_iter = stmt.query_map([snippet_id], |row| self.create_tag_from_row(row))?;

        let result: Vec<Tag> = tag_iter.flatten().collect();
        Ok(result)
        //Ok(tag_ids)
    }
    fn create_snippet_from_row(&self, row: &Row, conn: &Connection) -> rusqlite::Result<Snippet> {
        let text_type: usize = row.get(3)?;
        let c_time: u64 = row.get(4)?;
        let u_time: u64 = row.get(5).unwrap_or(c_time);

        let snippet_id = row.get(0)?;
        Ok(Snippet {
            id: snippet_id,
            title: row.get(1)?,
            text: row.get(2)?,
            text_type: TextType::from(text_type),
            tags: self.get_tags_for_snippet(snippet_id, conn)?,
            created_at: Timestamp::from(c_time),
            updated_at: Timestamp::from(u_time),
        })
    }
    fn create_tag_from_row(&self, row: &Row) -> rusqlite::Result<Tag> {
        let type_value: usize = row.get(3)?;
        let style = match row.get::<usize, Option<u32>>(4)? {
            Some(v) => Some(TagStyle {
                color: Color::Decimal(v),
            }),
            None => None,
        };
        Ok(Tag {
            id: row.get(0)?,
            title: row.get(1)?,
            parent_id: row.get::<usize, Option<usize>>(2)?,
            tag_type: TagType::from(type_value),
            tag_style: style,
        })
    }
}

impl StateTrait for Rusqlite {}
#[allow(unused)]
impl SnippetStore for Rusqlite {
    fn add_entry(&self, entry: CreateSnippet) -> Result<Snippet, CheatsheetError> {
        let mut c = self.conn.try_lock().unwrap();

        let ts = u64::from(Timestamp::from_utc_now());
        c.execute(
            "INSERT INTO Snippet (title, text, text_type, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5)",
            (&entry.title, &entry.text, entry.text_type as usize, ts, ts),
        )?;

        let snippet_id = c.last_insert_rowid();
        let tx = c.transaction()?;
        {
            let mut stmt =
                tx.prepare("INSERT INTO Snippet_Tags (snippet_id, tag_id) VALUES (?1, ?2)")?;

            for tag in &entry.tags {
                stmt.execute((snippet_id, tag.id))?;
            }
        }
        tx.commit()?;

        Ok(Snippet {
            id: snippet_id as usize,
            title: entry.title,
            text: entry.text,
            text_type: entry.text_type,
            tags: entry.tags,
            created_at: ts.into(),
            updated_at: ts.into(),
        })
    }

    fn delete_entry(&self, id: SnippetID) -> Result<Snippet, CheatsheetError> {
        let c = self.conn.try_lock().unwrap();

        let mut to_delete =
            c.query_row("SELECT * FROM Snippet WHERE snippet_id = ?1", [id], |r| {
                self.create_snippet_from_row(r, &c)
            })?;

        c.execute("DELETE FROM Snippet_Tags WHERE snippet_id = ?1", [id])?;
        c.execute("DELETE FROM Snippet WHERE snippet_id = ?1", [id])?;
        Ok(to_delete)
    }
    fn get_entry(&self, id: SnippetID) -> Result<Snippet, CheatsheetError> {
        let mut c = self.conn.try_lock().unwrap();

        let mut snippet =
            c.query_row("SELECT * FROM Snippet WHERE snippet_id = ?1", [id], |r| {
                self.create_snippet_from_row(r, &c)
            })?;

        Ok(snippet)
    }
    fn get_tags(&self, id: SnippetID) -> Result<Vec<Tag>, CheatsheetError> {
        let mut c = self.conn.try_lock().unwrap();
        let mut stmt = c.prepare("SELECT * FROM Tag INNER JOIN Snippet_Tags ON Snippet_Tags.snippet_id = ?1 AND Tag.tag_id = Snippet_Tags.tag_id ORDER BY tag_id")?;
        let tag_iter = stmt.query_map([id], |row| self.create_tag_from_row(row))?;

        let result: Vec<Tag> = tag_iter.flatten().collect();
        Ok(result)
    }
    fn add_tags(&self, snippet_id: SnippetID, tags: Vec<Tag>) -> Result<usize, CheatsheetError> {
        let mut c = self.conn.try_lock().unwrap();

        let mut count = 0;
        let tx = c.transaction()?;
        {
            let mut stmt =
                tx.prepare("INSERT INTO Snippet_Tags (snippet_id, tag_id) VALUES (?1, ?2)")?;

            for tag in &tags {
                if let Ok(c) = stmt.execute((snippet_id, tag.id)) {
                    count += c;
                }
            }
        }
        tx.commit()?;

        Ok(count)
    }
    fn update_text(&self, id: SnippetID, new_text: String) -> Result<bool, CheatsheetError> {
        let ts = u64::from(Timestamp::from_utc_now());

        let c = self.conn.try_lock().unwrap();

        c.execute(
            "UPDATE Snippet SET text = ?1, updated_at = ?2 WHERE snippet_id = ?3",
            (new_text, ts, id),
        )?;

        Ok(true)
    }
    fn update_title(&self, id: SnippetID, new_title: String) -> Result<bool, CheatsheetError> {
        let ts = u64::from(Timestamp::from_utc_now());

        let c = self.conn.try_lock().unwrap();

        c.execute(
            "UPDATE Snippet SET title = ?1, updated_at = ?2 WHERE snippet_id = ?3",
            (new_title, ts, id),
        )?;

        Ok(true)
    }

    fn remove_tag(&self, snippet_id: SnippetID, tag_id: TagID) -> Result<bool, CheatsheetError> {
        let c = self.conn.try_lock().unwrap();

        match c.execute(
            "DELETE FROM Snippet_Tags WHERE snippet_id = ?1 AND tag_id = ?2",
            (snippet_id, tag_id),
        ) {
            Ok(count) => Ok(true),
            Err(e) => Err(CheatsheetError::StoreError(e.to_string())),
        }
    }
    fn append_tag(&self, snippet_id: SnippetID, tag_id: TagID) -> Result<bool, CheatsheetError> {
        let c = self.conn.try_lock().unwrap();

        match c.execute(
            "INSERT INTO Snippet_Tags (snippet_id, tag_id) VALUES (?1, ?2)",
            (snippet_id, tag_id),
        ) {
            Ok(count) => Ok(true),
            Err(e) => Err(CheatsheetError::StoreError(e.to_string())),
        }
    }
    fn remove_tag_from_all(&self, tag_id: TagID) -> Result<usize, CheatsheetError> {
        let c = self.conn.try_lock().unwrap();

        match c.execute("DELETE FROM Snippet_Tags WHERE tag_id = ?1", [tag_id]) {
            Ok(count) => Ok(count),
            Err(e) => Err(CheatsheetError::StoreError(e.to_string())),
        }
    }
    fn get_snippet_list(
        &self,
        tag_filter: Option<Vec<TagID>>,
        time_boundry: Option<(Timestamp, Timestamp)>,
    ) -> Result<SnippetList, CheatsheetError> {
        let mut sql = String::from("SELECT * FROM Snippet");

        let mut tag_filtered = false;
        if let Some(tags) = tag_filter {
            let s = tags
                .iter()
                .map(|id| id.to_string())
                .collect::<Vec<String>>()
                .join(",");
            let temp = format!(
                " WHERE snippet_id IN (SELECT snippet_id FROM Snippet_Tags WHERE tag_id IN ({}))",
                s
            );
            sql.push_str(&temp);
            tag_filtered = true;
        }

        if let Some((from, to)) = time_boundry {
            let clause = if tag_filtered { "AND" } else { "WHERE" };
            let temp = format!(
                " {} updated_at BETWEEN {} AND {}",
                clause,
                u64::from(from),
                u64::from(to)
            );
            sql.push_str(&temp);
        }

        let c = self.conn.try_lock().unwrap();
        //println!("the query: {}", sql);

        let mut stmt = c.prepare(&sql)?;
        let snippet_iter = stmt.query_map([], |row| self.create_snippet_from_row(row, &c))?;

        let result: Vec<Snippet> = snippet_iter.flatten().collect();

        // for tag in &result[0].tags {
        //     match tag.tag_type {
        //         TagType::Normal => println!("found normal tag"),
        //         TagType::Category => println!("founf category tag"),
        //         _ => println!("found something else"),
        //     }
        // }
        //print!("result: {:?}", result);
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
        let c = self.conn.try_lock().unwrap();

        let color_option: Option<u32> = tag.tag_style.clone().map(|o| o.color.into());
        c.execute(
            "INSERT INTO Tag (title, parent_id, tag_type, tag_color) VALUES (?1, ?2, ?3, ?4)",
            (&tag.title, tag.parent_id, tag.tag_type as u32, color_option),
        )?;

        let tag_id = c.last_insert_rowid();

        Ok(Tag {
            id: tag_id as usize,
            title: tag.title,
            parent_id: tag.parent_id,
            tag_type: tag.tag_type,
            tag_style: tag.tag_style,
        })
        // Err(CheatsheetError::NotImplemented("add_tag not implemented".into()))
    }

    fn delete_tag(&self, id: TagID) -> Result<Tag, CheatsheetError> {
        let c = self.conn.try_lock().unwrap();

        let mut to_delete = c.query_row("SELECT * FROM Tag WHERE tag_id = ?1", [id], |r| {
            self.create_tag_from_row(r)
        })?;

        c.execute("DELETE FROM Tag WHERE tag_id = ?1", [id])?;
        Ok(to_delete)
    }
    fn get_tag(&self, id: TagID) -> Result<Tag, CheatsheetError> {
        let c = self.conn.try_lock().unwrap();

        let mut tag = c.query_row("SELECT * FROM Tag WHERE tag_id = ?1", [id], |r| {
            self.create_tag_from_row(r)
        })?;

        Ok(tag)
    }
    fn update_tag_parent(
        &self,
        id: TagID,
        new_parent_id: Option<TagID>,
    ) -> Result<bool, CheatsheetError> {
        let c = self.conn.try_lock().unwrap();
        if new_parent_id == Some(id) {
            return Ok(false);
        }
        c.execute(
            "UPDATE Tag SET parent_id = ?1 WHERE tag_id = ?2",
            (new_parent_id, id),
        )?;

        Ok(true)
    }
    fn update_tag_title(&self, id: TagID, new_title: String) -> Result<bool, CheatsheetError> {
        let c = self.conn.try_lock().unwrap();

        c.execute(
            "UPDATE Tag SET title = ?1 WHERE tag_id = ?2",
            (new_title, id),
        )?;

        Ok(true)
    }

    fn update_tag_type(&self, id: TagID, new_type: TagType) -> Result<bool, CheatsheetError> {
        let c = self.conn.try_lock().unwrap();

        c.execute(
            "UPDATE Tag SET tag_type = ?1 WHERE tag_id = ?2",
            (new_type as usize, id),
        )?;

        Ok(true)
    }

    fn get_tag_list(&self, type_filter: Option<TagType>) -> Result<TagList, CheatsheetError> {
        let c = self.conn.try_lock().unwrap();

        let mut sql: String = String::from("SELECT * FROM Tag");
        if let Some(tag_type) = type_filter {
            let temp = format!(" WHERE tag_type = {}", tag_type as usize);
            sql.push_str(&temp);
        }
        //let mut stmt = c.prepare("SELECT * FROM Tag")?;
        let mut stmt = c.prepare(&sql)?;
        let tag_iter = stmt.query_map([], |row| self.create_tag_from_row(row))?;

        //let result: Vec<Tag> = tag_iter.flat_map(|s|s).collect();
        let result: TagList = tag_iter.flatten().collect();
        Ok(result)
    }

    fn get_tag_hierarchy(&self, tag_id: TagID) -> Result<TagList, CheatsheetError> {
        let mut id_check = Some(tag_id);
        let mut list: TagList = TagList::from(Vec::new());

        let c = self.conn.try_lock().unwrap();

        while let Some(id) = id_check {
            let mut tag = c.query_row("SELECT * FROM Tag WHERE tag_id = ?1", [id], |r| {
                self.create_tag_from_row(r)
            })?;

            id_check = tag.parent_id.clone();
            list.push(tag);
        }
        Ok(list)
    }
    fn get_snippet_count_for_tag(&self, tag_id: TagID) -> Result<usize, CheatsheetError> {
        let c = self.conn.try_lock().unwrap();

        let result = c.query_row(
            "SELECT count(*) FROM Snippet_Tags WHERE tag_id = ?1",
            [tag_id],
            |row| row.get(0),
        )?;

        Ok(result)
    }
    fn search_tags_by_title(
        &self,
        pattern: &str,
        mode: SearchMode,
    ) -> Result<TagList, CheatsheetError> {
        let c = self.conn.try_lock().unwrap();
        let sql = match mode {
            SearchMode::Start => format!("SELECT * FROM Tag WHERE title LIKE '%{}'", pattern),
            _ => format!("SELECT * FROM Tag WHERE title LIKE '%{}%'", pattern),
        };
        let mut stmt = c.prepare(&sql)?;
        let tag_iter = stmt.query_map([], |row| self.create_tag_from_row(row))?;

        let result: TagList = tag_iter.flatten().collect();
        Ok(result)
    }
}

impl From<rusqlite::Error> for CheatsheetError {
    fn from(err: rusqlite::Error) -> Self {
        CheatsheetError::StoreError(err.to_string())
    }
}
