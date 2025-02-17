use domain::{
    //entities::entry::{CreateSnippet, CreateTag, TagType, TextType},
    entities::entry::TextType, utils::types::Timestamp
};

use core::time;
use std::{
    sync::{LazyLock, Mutex}, thread
};

use repository::{
    db::sqlite::rusqlite_db::{self, Rusqlite},
    ports::{services::Service, stores::{SnippetStore, TagStore}},
};

static STATIC_DB: LazyLock<Mutex<Rusqlite>> = LazyLock::new(|| {
    let mut db = rusqlite_db::Rusqlite::new_in_memory().unwrap();
    db.create_dummy_entries().unwrap();
    //let db = rusqlite_db::Rusqlite::new("../data/dev_db.db").unwrap();

    Mutex::new(db)
});

type TestResult<T = (), E = Box<dyn std::error::Error>> = std::result::Result<T, E>;

#[test]
fn test_sql_batch_creation() -> TestResult {
    let db = STATIC_DB.lock().unwrap();
    let result = db.get_tag_list(None).unwrap();
    assert_eq!(result.len(), 11);
    Ok(())
}

#[test]
fn test_delete_category() -> TestResult {
    let mut db = rusqlite_db::Rusqlite::new_in_memory().unwrap();
    db.create_dummy_entries().unwrap();

    let service = Service::new(Box::new(db));

    let _deleted = service.delete_tag(11).unwrap();

    let check_deleted = service.get_tag(11);
    assert!(check_deleted.is_err());

    let mut sub_deleted = service.get_tag(111).unwrap();
    assert_eq!(sub_deleted.parent_id, Some(1));

    let _deleted2 = service.delete_tag(1);

    sub_deleted = service.get_tag(111).unwrap();
    assert_eq!(sub_deleted.parent_id, None);

    Ok(())
}
#[test]
#[ignore = "check sleep workaround"]
fn test_02_list_filter() -> TestResult {
    let db = STATIC_DB.lock().unwrap();

    let snippet_list_1 = db.get_snippet_list(Some(vec![7, 2]), None).unwrap();
    assert_eq!(snippet_list_1.len(), 5);

    let snippet_list_2 = db.get_snippet_list(Some(vec![8]), None).unwrap();
    assert_eq!(snippet_list_2.len(), 2);

    thread::sleep(time::Duration::from_secs(2));
    let ts_before = Timestamp::from_utc_now();
    let _flag = db
        .update_text(1, "first content with new content".into(), TextType::Text)
        .unwrap();
    let ts_after = Timestamp::from_utc_now();

    let snippet_list_3 = db
        .get_snippet_list(None, Some((ts_before, ts_after)))
        .unwrap();
    println!("last list: {:#?}", snippet_list_3);
    assert_eq!(snippet_list_3.len(), 1);
    Ok(())
}

// #[test]
// fn test_03_delete_entry() -> TestResult {
//     let db = STATIC_DB.lock().unwrap();
//     let snippet = db.get_entry(1).unwrap();

//     assert_eq!(snippet.tags.len(), 2);

//     let deleted = db.delete_entry(1).unwrap();

//     assert_eq!(deleted.id, 1);

//     let snippet_result = db.get_entry(1);

//     assert!(snippet_result.is_err());
//     Ok(())
// }

// #[test]
// fn test_04_add_tags() -> TestResult {
//     let db = STATIC_DB.lock().unwrap();

//     let tags = db.get_tag_list(None).unwrap();
//     //snippet 2 tags -> 1, 6 (index)
//     let count = db
//         .add_tags(2, vec![tags[2].clone(), tags[4].clone()])
//         .unwrap();

//     assert_eq!(count, 2);

//     let snippet = db.get_entry(2).unwrap();

//     assert_eq!(snippet.tags.len(), 4);

//     let count = db
//         .add_tags(2, vec![tags[2].clone(), tags[4].clone()])
//         .unwrap();

//     assert_eq!(count, 0);

//     //test add already tagged with
//     let snippet = db.get_entry(2).unwrap();

//     assert_eq!(snippet.tags.len(), 4);

//     Ok(())
// }
// #[test]
// fn test_05_update_tags() -> TestResult {
//     let db = STATIC_DB.lock().unwrap();

//     db.update_tag_parent(2, Some(4)).unwrap();
//     db.update_tag_title(2, "sub1 to sub2".into()).unwrap();
//     db.update_tag_type(2, TagType::Category).unwrap();

//     let tag = db.get_tag(2).unwrap();

//     assert_eq!(tag.title, "sub1 to sub2");
//     assert_eq!(tag.parent_id, Some(4));
//     assert_eq!(TagType::from(tag.tag_type), TagType::Category);

//     let tag_list = db.get_tag_hierarchy(2).unwrap();
//     println!("{:#?}", tag_list);

//     assert_eq!(tag_list.len(), 2);
//     Ok(())
// }
