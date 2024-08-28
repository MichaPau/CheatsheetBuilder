pub mod ports {
    pub mod ports;
}

pub mod errors;
pub mod types;

pub mod tools {
    pub mod parse_joplin;
}

pub mod db {
    pub mod sqlite {
        pub mod rusqlite;
    }
}

pub mod memory {
    pub mod hashmap_store;
}

#[cfg(test)]
mod test {
    use domain::entities::entry::{CreateSnippet, CreateTag};

    use crate::{db::sqlite::rusqlite, ports::ports::{SnippetStore, TagStore}};

    #[test]
    fn test_snippet_store() {
        println!("{}", std::env::current_dir().unwrap().display());
        let mut db = rusqlite::Rusqlite::new_in_memory().unwrap();
        //let db = rusqlite::Rusqlite::open("../data/test_db.db").unwrap();

        let l = vec![
            CreateSnippet::new("first".into(), "first content".into(), vec![]),
            CreateSnippet::new("second".into(), "second content".into(), vec![]),
            CreateSnippet::new("third".into(), "third content".into(), vec![]),


        ];

        for s in l {
            db.add_entry(s).unwrap();
        }

        let r = db.get_snippet_list(None, None).unwrap();

        assert_eq!(r.len(), 3);
        // println!("result len: {}", r.len());

        // for s in r {
        //     println!("{:?}", s);
        // }
        //println!("{:?}", db.conn.path());
        //assert_eq!(db.conn.path(), Some(""));
        // let _ = db.conn.pragma_query(None, "table_list", |row| {
        //     println!("{:?}", row);
        //     let mut i: usize = 0;
        //     while let Ok(column) = row.get::<usize, String>(i) {
        //         println!("{:?}", column);
        //         i += 1;
        //     }
            
        //     Ok(())
        // }).unwrap();
        
    }

    #[test]
    fn test_tag_store() {
        use domain::entities::entry::{CreateTag, TagType};

        let db = rusqlite::Rusqlite::new_in_memory().unwrap();

        let l = vec![
            CreateTag { title: "one".into(), tag_type: TagType::Category, parent_id: None},
            CreateTag { title: "two".into(), tag_type: TagType::Category, parent_id: None},
            CreateTag { title: "three".into(), tag_type: TagType::Category, parent_id: None},
        ];

        for t in l {
            let _ = db.add_tag(t);

        }

        let r = db .get_list().unwrap();

        for i in r {
            println!("{:?}", i);
        }
    }
}