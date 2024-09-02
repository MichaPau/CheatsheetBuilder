use domain::{entities::entry::{CreateSnippet, CreateTag}, utils::types::Timestamp};

use core::time;
use std::{sync::{LazyLock, Mutex}, thread};

use repository::{db::sqlite::rusqlite_db::{self, Rusqlite}, ports::stores::{SnippetStore, TagStore}, types::TagListItem};

static STATIC_DB: LazyLock<Mutex<Rusqlite>> = LazyLock::new(|| {

    let db = rusqlite_db::Rusqlite::new_in_memory().unwrap();
    //let db = rusqlite_db::Rusqlite::new("../data/test_db.db").unwrap();
    

    Mutex::new(db)

});

type TestResult<T = (), E = Box<dyn std::error::Error>> = std::result::Result<T, E>;

#[test]
fn test_inserts() -> TestResult {
    let mut db = STATIC_DB.lock().unwrap();

    let hierarque_tags: Vec<TagListItem> = vec![
        TagListItem {
            tag: CreateTag { title: "one".into(), ..Default::default() },
            childs: vec![
                CreateTag { title: "one_sub_1".into(), ..Default::default() },
                CreateTag { title: "one_sub_2".into(), ..Default::default() }
            ],
        },
        TagListItem {
            tag: CreateTag { title: "two".into(), ..Default::default()},
            childs: vec![
                CreateTag { title: "two_sub_1".into(), ..Default::default() }
            ],
        },
        TagListItem {
            tag: CreateTag { title: "three".into(), ..Default::default() },
            childs: vec![],
        },
        TagListItem {
            tag: CreateTag { title: "all".into(), ..Default::default() },
            childs: vec![],
        },
        TagListItem {
            tag: CreateTag { title: "some".into(), ..Default::default() },
            childs: vec![],
        },
    ];


    let tag_count: usize = hierarque_tags.iter().map(|tag_item| tag_item.count_tags()).sum();

    for item in hierarque_tags {
        let tag_added = db.add_tag(item.tag).unwrap();
        for mut sub_item in item.childs {
            sub_item.parent_id = Some(tag_added.id);
            let _ = db.add_tag(sub_item).unwrap();
        }
    }

    let tag_list = db.get_list().unwrap();

    assert_eq!(tag_list.len(), tag_count);
    
   
    let snippets_data = vec![
        CreateSnippet::new("first".into(), "first content".into(), vec![tag_list[0].clone(), tag_list[6].clone()]),
        CreateSnippet::new("first again".into(), "first again content".into(), vec![tag_list[1].clone(), tag_list[6].clone()]),
        CreateSnippet::new("second".into(), "second content".into(), vec![tag_list[3].clone(), tag_list[6].clone(), tag_list[7].clone()]),
        CreateSnippet::new("third".into(), "third content".into(), vec![tag_list[5].clone(), tag_list[6].clone()]),
        CreateSnippet::new("third again".into(), "third again content".into(), vec![tag_list[7].clone(), tag_list[6].clone()]),

    ];

    for item in snippets_data.iter() {
        let added = db.add_entry(item.clone()).unwrap();
        println!("added: {:?}", added);
    }

    let fetched = db.get_entry(1).unwrap();
    println!("fetched: {:?}", fetched);

    let snippet_list = db.get_snippet_list(None, None).unwrap();
    //println!("ts first: {}", snippet_list.get(0).unwrap().updated_at);
    assert_eq!(snippet_list.len(), snippets_data.len());

    Ok(())
}
#[test]
#[ignore = "check sleep workaround"]
fn test_list_filter() -> TestResult {
    
    let db = STATIC_DB.lock().unwrap();
    
    let snippet_list_1 = db.get_snippet_list(Some(vec![7, 2]), None).unwrap();
    assert_eq!(snippet_list_1.len(), 5);

    let snippet_list_2 = db.get_snippet_list(Some(vec![8]), None).unwrap();
    assert_eq!(snippet_list_2.len(), 2);
    
    
    thread::sleep(time::Duration::from_secs(2));
    let ts_before = Timestamp::from_utc_now();
    let _flag = db.update_text(1, "first content with new content".into()).unwrap();
    let ts_after = Timestamp::from_utc_now();

    let snippet_list_3 = db.get_snippet_list(None, Some((ts_before, ts_after))).unwrap();
    println!("last list: {:#?}", snippet_list_3);
    assert_eq!(snippet_list_3.len(), 1);
    Ok(())
}

#[test]
fn test_new_funcs() -> TestResult {
    let db = STATIC_DB.lock().unwrap();
    let snippet = db.get_entry(1).unwrap();

    println!("{:?}", snippet);
    assert_eq!(snippet.tags.len(), 2);

    println!("debug tags: {:#?}", snippet.tags);

    let deleted = db.delete_entry(1).unwrap();

    assert_eq!(deleted.id, 1);

    let snippet_result = db.get_entry(1);

    assert!(snippet_result.is_err());
    Ok(())
}
#[test]
fn test_update_tags() -> TestResult {
   
    let _db = STATIC_DB.lock().unwrap();
    
    Ok(())
}

