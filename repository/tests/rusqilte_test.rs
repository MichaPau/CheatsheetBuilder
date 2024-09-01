use domain::{entities::entry::{CreateSnippet, CreateTag, TagType}, utils::types::Timestamp};

use core::time;
use std::{sync::{LazyLock, Mutex}, thread};

use repository::{db::sqlite::rusqlite::{self, Rusqlite}, ports::ports::{SnippetStore, TagStore}, types::TagListItem};

static STATIC_DB: LazyLock<Mutex<Rusqlite>> = LazyLock::new(|| {

    let db = rusqlite::Rusqlite::new_in_memory().unwrap();
    

    Mutex::new(db)

});

type TestResult<T = (), E = Box<dyn std::error::Error>> = std::result::Result<T, E>;

#[test]
fn test_inserts() -> TestResult {
    let mut db = STATIC_DB.lock().unwrap();

    let hierarque_tags: Vec<TagListItem> = vec![
        TagListItem {
            tag: CreateTag { title: "one".into(), tag_type: TagType::Normal, parent_id: None },
            childs: vec![
                CreateTag { title: "one_sub_1".into(), tag_type: TagType::Normal, parent_id: None },
                CreateTag { title: "one_sub_2".into(), tag_type: TagType::Normal, parent_id: None }
            ],
        },
        TagListItem {
            tag: CreateTag { title: "two".into(), tag_type: TagType::Normal, parent_id: None },
            childs: vec![
                CreateTag { title: "two_sub_1".into(), tag_type: TagType::Normal, parent_id: None }
            ],
        },
        TagListItem {
            tag: CreateTag { title: "three".into(), tag_type: TagType::Normal, parent_id: None },
            childs: vec![],
        },
        TagListItem {
            tag: CreateTag { title: "all".into(), tag_type: TagType::Normal, parent_id: None },
            childs: vec![],
        },
        TagListItem {
            tag: CreateTag { title: "some".into(), tag_type: TagType::Normal, parent_id: None },
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
        CreateSnippet::new("first".into(), "first content".into(), vec![7, 1]),
        CreateSnippet::new("first again".into(), "first again content".into(), vec![7, 2]),
        CreateSnippet::new("second".into(), "second content".into(), vec![4, 7, 8]),
        CreateSnippet::new("third".into(), "third content".into(), vec![6, 7]),
        CreateSnippet::new("third again".into(), "third again content".into(), vec![7, 8]),

    ];

    for item in snippets_data.iter() {
        db.add_entry(item.clone()).unwrap();
    }

    let snippet_list = db.get_snippet_list(None, None).unwrap();
    println!("ts first: {}", snippet_list.get(0).unwrap().updated_at);
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
    let s1 = db.get_entry(1).unwrap();

    println!("{:?}", s1);
    assert_eq!(s1.tags, [1, 7]);

    Ok(())
}
#[test]
fn test_update_tags() -> TestResult {
   
    let _db = STATIC_DB.lock().unwrap();
    
    Ok(())
}

