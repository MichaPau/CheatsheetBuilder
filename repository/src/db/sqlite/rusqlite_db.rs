use std::{path::Path, sync::Mutex};

use domain::{entities::entry::*, utils::types::{SearchPattern, Timestamp}};
use rusqlite::{Connection, OpenFlags, Row};

use crate::{errors::CheatsheetError, ports::stores::{SnippetStore, TagStore, StateTrait}, types::TagListItem};

#[derive(Debug)]
pub struct Rusqlite {
    pub conn: Mutex<Connection>,
}


impl Rusqlite {
    pub fn new<P: AsRef<Path>>(path: P) -> rusqlite::Result<Self> {
        let conn = Connection::open(path)?;
        let db = Self {
            conn: Mutex::new(conn),
        };

        db.create_default_tables()?;

        Ok(db)
    }

    pub fn open<P: AsRef<Path>>(path: P) -> rusqlite::Result<Self> {
        let conn = Connection::open_with_flags(
            path,
            OpenFlags::SQLITE_OPEN_READ_WRITE
            | OpenFlags::SQLITE_OPEN_URI
            | OpenFlags::SQLITE_OPEN_NO_MUTEX)?;
        
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
            | OpenFlags::SQLITE_OPEN_NO_MUTEX
        )?;

        let mut db = Self {
            conn: Mutex::new(conn),
        };

        db.create_default_tables()?;
        db.create_dummy_entries();
        Ok(db)
    }

    pub fn create_dummy_entries(&mut self) {
        println!("create dummy data");
        let hierarque_tags: Vec<TagListItem> = vec![
            TagListItem {
                tag: CreateTag { title: "one".into(), tag_type: TagType::Category, tag_style: Some(TagStyle {color: Color::RGB((255, 255, 255))}),  ..Default::default() },
                childs: vec![
                    CreateTag { title: "one_sub_1".into(), tag_type: TagType::Category, ..Default::default() },
                    CreateTag { title: "one_sub_2".into(), tag_type: TagType::Category, ..Default::default() }
                ],
            },
            TagListItem {
                tag: CreateTag { title: "two".into(), tag_type: TagType::Category, ..Default::default()},
                childs: vec![
                    CreateTag { title: "two_sub_1".into(), tag_type: TagType::Category, ..Default::default() }
                ],
            },
            TagListItem {
                tag: CreateTag { title: "three".into(), tag_type: TagType::Category, ..Default::default() },
                childs: vec![
                    CreateTag { title: "three_sub_1".into(), tag_type: TagType::Category, ..Default::default() }
                ],
            },
            TagListItem {
                tag: CreateTag { title: "all".into(), tag_type: TagType::Category, ..Default::default() },
                childs: vec![],
            },
            TagListItem {
                tag: CreateTag { title: "some".into(), tag_type: TagType::Category, ..Default::default() },
                childs: vec![],
            },
        ];



        for item in hierarque_tags {
            let tag_added = self.add_tag(item.tag).unwrap();
            for mut sub_item in item.childs {
                sub_item.parent_id = Some(tag_added.id);
                let _ = self.add_tag(sub_item).unwrap();
            }
        }
        
        let tag_list = self.get_tag_list(None).unwrap();
        let snippets_data = vec![
            CreateSnippet::new("first".into(), "first content".into(), vec![tag_list[0].clone(), tag_list[6].clone()]),
            CreateSnippet::new("first again".into(), "first again content".into(), vec![tag_list[1].clone(), tag_list[6].clone()]),
            CreateSnippet::new("second".into(), "second content".into(), vec![tag_list[3].clone(), tag_list[6].clone(), tag_list[7].clone()]),
            CreateSnippet::new("third".into(), "third content".into(), vec![tag_list[5].clone(), tag_list[6].clone()]),
            CreateSnippet::new("third again".into(), "third again content".into(), vec![tag_list[7].clone(), tag_list[6].clone()]),

        ];

        for item in snippets_data.iter() {
            let _added = self.add_entry(item.clone()).unwrap();
            //println!("added: {:?}", added);
        }
    }
    fn create_default_tables(&self) -> rusqlite::Result<bool> {
        println!("createdefault tables");
        self.conn.lock().unwrap().execute(
            "CREATE TABLE IF NOT EXISTS Snippet (
                snippet_id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                text TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            )", 
            ()
        )?;

        self.conn.lock().unwrap().execute(
            "CREATE TABLE IF NOT EXISTS Tag (
                tag_id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                parent_id INTEGER,
                tag_type INTEGER,
                tag_color INTEGER
            )", 
            ()
        )?;

        self.conn.lock().unwrap().execute(
            "CREATE TABLE IF NOT EXISTS Snippet_Tags (
                id INTEGER PRIMARY KEY,
                snippet_id INTEGER NOT NULL,
                tag_id INTEGER,

                FOREIGN KEY (snippet_id) REFERENCES Snippet (snippet_id),
                FOREIGN KEY (tag_id) REFERENCES Tag (tag_id),

                UNIQUE(snippet_id, tag_id) ON CONFLICT IGNORE
            )", 
            ()
        )?;

        Ok(true)
    }

    #[allow(dead_code)]
    fn get_tag_ids_for_snippet(&self, snippet_id: SnippetID, conn: &Connection) -> rusqlite::Result<Vec<TagID>> {
        
        //let c = self.conn.try_lock().unwrap();
        let mut stmt = conn.prepare("SELECT tag_id FROM Snippet_Tags WHERE snippet_id = ?1 ORDER BY tag_id")?;
        let rows = stmt.query_map([snippet_id], |row| row.get::<usize, usize>(0))?;
        
        let tag_ids: Vec<TagID> = rows.into_iter().map(Result::unwrap).collect();

        //std::mem::drop(c);
        Ok(tag_ids)
    }

    fn get_tags_for_snippet(&self, snippet_id: SnippetID, conn: &Connection) -> rusqlite::Result<Vec<Tag>>  {
        
        //let c = self.conn.try_lock().unwrap();

        let mut stmt = conn.prepare("SELECT * FROM Tag INNER JOIN Snippet_Tags ON Snippet_Tags.snippet_id = ?1 AND Tag.tag_id = Snippet_Tags.tag_id ORDER BY tag_id")?;
        let tag_iter = stmt.query_map([snippet_id], |row| {
            self.create_tag_from_row(row)
        })?;

        let result: Vec<Tag> = tag_iter.flatten().collect();
        Ok(result)
        //Ok(tag_ids)
    }
    fn create_snippet_from_row(&self, row: &Row, conn: &Connection) -> rusqlite::Result<Snippet> {
        let c_time: u64  = row.get(3)?;
        let u_time: u64 = row.get(4).unwrap_or(c_time);
        
        let snippet_id = row.get(0)?;
        Ok(Snippet {
            id: snippet_id,
            title: row.get(1)?,
            text: row.get(2)?,
            tags: self.get_tags_for_snippet(snippet_id, conn)?,
            created_at: Timestamp::from(c_time),
            updated_at: Timestamp::from(u_time),
        })
    }
    fn create_tag_from_row(&self, row: &Row) -> rusqlite::Result<Tag> {
        let type_value: usize = row.get(3)?;
        let style = match row.get::<usize, Option<u32>>(4)? {
            Some(v) => Some(TagStyle {color: Color::Decimal(v)}),
            None => None,
        };
        Ok(
            Tag {
                id: row.get(0)?,
                title: row.get(1)?,
                parent_id: row.get::<usize, Option<usize>>(2)?,
                tag_type: TagType::from(type_value),
                tag_style: style,
            }
        )
    }
}

impl StateTrait for Rusqlite {}
#[allow(unused)]
impl SnippetStore for Rusqlite {
    fn add_entry(&mut self, entry: CreateSnippet) -> Result<Snippet, CheatsheetError> {

        let mut c = self.conn.try_lock().unwrap();

        let ts = u64::from(Timestamp::from_utc_now());
        c.execute(
            "INSERT INTO Snippet (title, text, created_at, updated_at) VALUES (?1, ?2, ?3, ?4)",
            (&entry.title, &entry.text, ts, ts)
        )?;

        let snippet_id = c.last_insert_rowid();
        let tx = c.transaction()?;
        {
            let mut stmt = tx.prepare("INSERT INTO Snippet_Tags (snippet_id, tag_id) VALUES (?1, ?2)")?;

            for tag in &entry.tags {
                stmt.execute((snippet_id, tag.id))?;
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
        
        let c = self.conn.try_lock().unwrap();

        let mut to_delete = c.query_row(
            "SELECT * FROM Snippet WHERE snippet_id = ?1", 
            [id], |r| {
                self.create_snippet_from_row(r, &c)
            })?;
        
        c.execute(
            "DELETE FROM Snippet_Tags WHERE snippet_id = ?1", 
            [id]
        )?;
        c.execute(
            "DELETE FROM Snippet WHERE snippet_id = ?1",
            [id]
        )?;
        Ok(to_delete)
        
    }
    fn get_entry(&self, id: SnippetID) -> Result<Snippet, CheatsheetError> {
        println!("1: {:?}", self.conn);
        let mut c = self.conn.try_lock().unwrap();
        println!("2: {:?}", c);
        let mut snippet = c.query_row(
            "SELECT * FROM Snippet WHERE snippet_id = ?1", 
            [id], |r| {
                self.create_snippet_from_row(r, &c)
            })?;
        println!("3");
        Ok(snippet)
    }
    fn add_tags(&mut self, snippet_id: SnippetID, tags: Vec<Tag>) -> Result<usize, CheatsheetError> {
        
        let mut c = self.conn.try_lock().unwrap();

        let mut count = 0;
        let tx = c.transaction()?;
        {
            let mut stmt = tx.prepare("INSERT INTO Snippet_Tags (snippet_id, tag_id) VALUES (?1, ?2)")?;

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
            (new_text, ts, id)
        )?;

        Ok(true)
    }

    fn remove_tag(&self, snippet_id: SnippetID, tag_id:TagID) -> Result<bool, CheatsheetError> {

        let c = self.conn.try_lock().unwrap();

        match c.execute(
            "DELETE FROM Snippet_Tags WHERE snippet_id = ?1 AND tag_id = ?2", 
            (snippet_id, tag_id)
        ) {
            Ok(count) => Ok(true),
            Err(e) => Err(CheatsheetError::StoreError(e.to_string())),
        }
    }
    fn remove_tag_from_all(&self, tag_id:TagID) -> Result<usize, CheatsheetError> {

        let c = self.conn.try_lock().unwrap();

        match c.execute(
            "DELETE FROM Snippet_Tags WHERE tag_id = ?1", 
            [tag_id]
        ) {
            Ok(count) => Ok(count),
            Err(e) => Err(CheatsheetError::StoreError(e.to_string())),
        }

        
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

        let c = self.conn.try_lock().unwrap();
        //println!("the query: {}", sql);

        

        let mut stmt = c.prepare(&sql)?;
        let snippet_iter = stmt.query_map([], |row| {
            self.create_snippet_from_row(row, &c)
        })?;

        
        let result: Vec<Snippet> = snippet_iter.flatten().collect();
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
            (&tag.title, tag.parent_id, tag.tag_type as u32, color_option)
        )?;

        let tag_id = c.last_insert_rowid();

        Ok(
            Tag {
                id: tag_id as usize,
                title: tag.title,
                parent_id: tag.parent_id,
                tag_type: tag.tag_type,
                tag_style: tag.tag_style,

            }
        )
        // Err(CheatsheetError::NotImplemented("add_tag not implemented".into()))
    }

    fn delete_tag(&self, id: TagID) -> Result<Tag, CheatsheetError> {

        let c = self.conn.try_lock().unwrap();

        let mut to_delete = c.query_row(
            "SELECT * FROM Tag WHERE tag_id = ?1", 
            [id], |r| {
                self.create_tag_from_row(r)
            })?;
        
        
        c.execute(
            "DELETE FROM Tag WHERE tag_id = ?1",
            [id]
        )?;
        Ok(to_delete)
        
    }
    fn get_tag(&self, id: TagID) -> Result<Tag, CheatsheetError> {
        
        let c = self.conn.try_lock().unwrap();

        let mut tag = c.query_row(
            "SELECT * FROM Tag WHERE tag_id = ?1", 
            [id], |r| {
                self.create_tag_from_row(r)
            })?;
        
        Ok(tag)
        
    }
    fn update_tag_parent(&self, id: TagID, new_parent_id: Option<TagID>) -> Result<bool, CheatsheetError> {

        let c = self.conn.try_lock().unwrap();

        c.execute(
            "UPDATE Tag SET parent_id = ?1 WHERE tag_id = ?2",
            (new_parent_id, id)
        )?;

        Ok(true)
        
    }
    fn update_tag_title(&self, id: TagID, new_title: String) -> Result<bool, CheatsheetError> {

        let c = self.conn.try_lock().unwrap();

        c.execute(
            "UPDATE Tag SET title = ?1 WHERE tag_id = ?2",
            (new_title, id)
        )?;

        Ok(true)
    }

    fn update_tag_type(&self, id: TagID, new_type: TagType) -> Result<bool, CheatsheetError> {

        let c = self.conn.try_lock().unwrap();

        c.execute(
            "UPDATE Tag SET tag_type = ?1 WHERE tag_id = ?2",
            (new_type as usize, id)
        )?;

        Ok(true)
    }

    fn get_tag_list(&self, type_filter: Option<TagType>) -> Result<TagList, CheatsheetError> {

        let c = self.conn.try_lock().unwrap();

        let mut stmt = c.prepare("SELECT * FROM Tag")?;
        let tag_iter = stmt.query_map([], |row| {
           self.create_tag_from_row(row)
        })?;

        //let result: Vec<Tag> = tag_iter.flat_map(|s|s).collect();
        let result: TagList = tag_iter.flatten().collect();
        Ok(result)
    }

    fn get_tag_hierarchy(&self, tag_id: TagID) -> Result<TagList, CheatsheetError> {
        // let mut tag = self.conn.query_row(
        //     "SELECT * FROM Tag WHERE tag_id = ?1", 
        //     [id], |r| {
        //         self.create_tag_from_row(r)
        //     })?;
        
        // Ok(tag)
        let mut id_check = Some(tag_id);
        let mut list: TagList = TagList::from(Vec::new());

        let c = self.conn.try_lock().unwrap();

        while let Some(id) = id_check {
            let mut tag = c.query_row(
                "SELECT * FROM Tag WHERE tag_id = ?1", 
                [id], |r| {
                    self.create_tag_from_row(r)
                })?;
            
            id_check = tag.parent_id.clone();
            list.push(tag);
            
        } 
        Ok(list)
    }
    
}
impl From<rusqlite::Error> for CheatsheetError {
    fn from(err: rusqlite::Error) -> Self {
        CheatsheetError::StoreError(err.to_string())
    }
}


