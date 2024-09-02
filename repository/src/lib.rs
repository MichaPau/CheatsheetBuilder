pub mod ports {
    pub mod stores;
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

// #[cfg(test)]
// mod test {
//     use domain::entities::entry::{CreateSnippet, CreateTag, TagType};

//     use std::sync::{LazyLock, Mutex};

//     use crate::{db::sqlite::rusqlite::{self, Rusqlite}, ports::ports::{SnippetStore, TagStore}, types::TagListItem};

//     static STATIC_DB: LazyLock<Mutex<Rusqlite>> = LazyLock::new(|| {

//         let mut db = rusqlite::Rusqlite::new_in_memory().unwrap();
//         let hierarque_tags: Vec<TagListItem> = vec![
//             TagListItem {
//                 tag: CreateTag { title: "one".into(), tag_type: TagType::Normal, parent_id: None },
//                 childs: vec![
//                     CreateTag { title: "one_sub_1".into(), tag_type: TagType::Normal, parent_id: None },
//                     CreateTag { title: "one_sub_2".into(), tag_type: TagType::Normal, parent_id: None }
//                 ],
//             },
//             TagListItem {
//                 tag: CreateTag { title: "two".into(), tag_type: TagType::Normal, parent_id: None },
//                 childs: vec![
//                     CreateTag { title: "two_sub_1".into(), tag_type: TagType::Normal, parent_id: None }
//                 ],
//             },
//             TagListItem {
//                 tag: CreateTag { title: "three".into(), tag_type: TagType::Normal, parent_id: None },
//                 childs: vec![],
//             },
//             TagListItem {
//                 tag: CreateTag { title: "all".into(), tag_type: TagType::Normal, parent_id: None },
//                 childs: vec![],
//             },
//             TagListItem {
//                 tag: CreateTag { title: "some".into(), tag_type: TagType::Normal, parent_id: None },
//                 childs: vec![],
//             },
//         ];

//         for item in hierarque_tags {
//             let tag_added = db.add_tag(item.tag).unwrap();
//             for mut sub_item in item.childs {
//                 sub_item.parent_id = Some(tag_added.id);
//                 let _ = db.add_tag(sub_item).unwrap();
//             }
//         }

//         let snippets_data = vec![
//             CreateSnippet::new("first".into(), "first content".into(), vec![7, 1]),
//             CreateSnippet::new("first again".into(), "first again content".into(), vec![7, 2]),
//             CreateSnippet::new("second".into(), "second content".into(), vec![4, 7, 8]),
//             CreateSnippet::new("third".into(), "third content".into(), vec![6, 7]),
//             CreateSnippet::new("third again".into(), "third again content".into(), vec![7, 8]),

//         ];

//         for item in snippets_data {
//             db.add_entry(item).unwrap();
//         }

//         Mutex::new(db)
    
//     });
//     #[test]
//     #[ignore]
//     fn test_snippet_store() {
        
//         let mut db = STATIC_DB.lock().unwrap();
//         //let mut db = rusqlite::Rusqlite::new_in_memory().unwrap();
//         //let db = rusqlite::Rusqlite::open("../data/test_db.db").unwrap();

//         let l = vec![
//             CreateSnippet::new("first".into(), "first content".into(), vec![]),
//             CreateSnippet::new("second".into(), "second content".into(), vec![]),
//             CreateSnippet::new("third".into(), "third content".into(), vec![]),


//         ];

//         for s in l {
//             db.add_entry(s).unwrap();
//         }

//         let r = db.get_snippet_list(None, None).unwrap();

//         assert_eq!(r.len(), 3);
//         // }).unwrap();
        
//     }

//     #[test]
//     #[ignore]
//     fn test_tag_store() {

//         //Let db = rusqlite::Rusqlite::new_in_memory().unwrap();
//         let db = STATIC_DB.lock().unwrap();

//         let l = vec![
//             CreateTag { title: "one".into(), tag_type: TagType::Category, parent_id: None},
//             CreateTag { title: "two".into(), tag_type: TagType::Category, parent_id: None},
//             CreateTag { title: "three".into(), tag_type: TagType::Category, parent_id: None},
//         ];

//         for t in l {
//             let _ = db.add_tag(t);

//         }

//         let r = db .get_list().unwrap();

//         assert_eq!(r.len(), 3);
//     }

//     #[test]
//     fn temp_list_test() {
//         //let db = rusqlite::Rusqlite::open("../data/test_db.db").unwrap();
//         let db = STATIC_DB.lock().unwrap();
//         let snippet_list_2 = db.get_snippet_list(Some(vec![7, 2]), None).unwrap();
//         assert_eq!(snippet_list_2.len(), 5);

//         let snippet_list_3 = db.get_snippet_list(Some(vec![8]), None).unwrap();
//         assert_eq!(snippet_list_3.len(), 2);

//     }

//     #[test]
//     fn edit_db () {
//         let mut db = STATIC_DB.lock().unwrap();

//         let add_snippet = CreateSnippet {
//             title: "new_snippet".into(),
//             text: "new content".into(),
//             tags: vec![],
//         };

//         let entry = db.add_entry(add_snippet).unwrap();
//         print!("{:?}", entry);
//     }

//     #[test]
//     fn test_edited_db() {
//         let db = STATIC_DB.lock().unwrap();

//         let result = db.get_snippet_list(None, None).unwrap();
//         assert_eq!(result.len(), 6);
//     }
//     #[test]
//     #[ignore]
//     fn realish_data_test() {

//         //let mut db = rusqlite::Rusqlite::new_in_memory().unwrap();
//         let mut db = rusqlite::Rusqlite::new("../data/test_db.db").unwrap();

//         let hierarque_tags: Vec<TagListItem> = vec![
//             TagListItem {
//                 tag: CreateTag { title: "one".into(), tag_type: TagType::Normal, parent_id: None },
//                 childs: vec![
//                     CreateTag { title: "one_sub_1".into(), tag_type: TagType::Normal, parent_id: None },
//                     CreateTag { title: "one_sub_2".into(), tag_type: TagType::Normal, parent_id: None }
//                 ],
//             },
//             TagListItem {
//                 tag: CreateTag { title: "two".into(), tag_type: TagType::Normal, parent_id: None },
//                 childs: vec![
//                     CreateTag { title: "two_sub_1".into(), tag_type: TagType::Normal, parent_id: None }
//                 ],
//             },
//             TagListItem {
//                 tag: CreateTag { title: "three".into(), tag_type: TagType::Normal, parent_id: None },
//                 childs: vec![],
//             },
//             TagListItem {
//                 tag: CreateTag { title: "all".into(), tag_type: TagType::Normal, parent_id: None },
//                 childs: vec![],
//             },
//             TagListItem {
//                 tag: CreateTag { title: "some".into(), tag_type: TagType::Normal, parent_id: None },
//                 childs: vec![],
//             },
//         ];

//         for item in hierarque_tags {
//             let tag_added = db.add_tag(item.tag).unwrap();
//             for mut sub_item in item.childs {
//                 sub_item.parent_id = Some(tag_added.id);
//                 let _ = db.add_tag(sub_item).unwrap();
//             }
//         }

//         let tag_list = db.get_list().unwrap();
//         assert_eq!(tag_list.len(), 8);

//         let snippets_data = vec![
//             CreateSnippet::new("first".into(), "first content".into(), vec![7, 1]),
//             CreateSnippet::new("first again".into(), "first again content".into(), vec![7, 2]),
//             CreateSnippet::new("second".into(), "second content".into(), vec![4, 7, 8]),
//             CreateSnippet::new("third".into(), "third content".into(), vec![6, 7]),
//             CreateSnippet::new("third again".into(), "third again content".into(), vec![7, 8]),

//         ];

//         for item in snippets_data {
//             db.add_entry(item).unwrap();
//         }

//         // let snippet_list = db.get_snippet_list(None, None).unwrap();
//         // assert_eq!(snippet_list.len(), 5);

//         // let snippet_list_2 = db.get_snippet_list(Some(vec![7, 2]), None).unwrap();
//         // assert_eq!(snippet_list_2.len(), 5);

//         // let snippet_list_3 = db.get_snippet_list(Some(vec![8]), None).unwrap();
//         // assert_eq!(snippet_list_3.len(), 2);



//     }
// }