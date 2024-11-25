//use std::{collections::HashMap, fs, path::{Path, PathBuf}};

// use repository::{
//     //entities::entry::{CreateSnippet, CreateTag}, 
//     // db::sqlite::rusqlite_db::Rusqlite, ports::{services::Service, stores::{SnippetStore, TagStore}}
//  };

//use repository::memory::hashmap_store::HashMapStore;

use std::env;
//use presentation::gui::tauri_gui::tauri_gui_lib;
//use tauri_gui_solid_lib;


//use presentation::tui::ratatui::ratatui;
// use presentation::gui::xilem::xilem::{self, AppState};

use repository::{db::sqlite::rusqlite_db::Rusqlite, ports::services::Service, types::AppState};
//use presentation::tui::cursive::cursive;
//https://github.com/howtocodeit/hexarch
//https://www.howtocodeit.com/articles/master-hexagonal-architecture-rust#service-the-heart-of-hexagonal-architecture



fn main() {

    env::set_var("RUST_BACKTRACE", "1");
    println!("Hello, cheatsheet builder new tauri!");

    let store = Rusqlite::new_in_memory().unwrap();
    let service = Service::new(Box::new(store));

    let _app_state = AppState {
        service,
    };

    //tauri_gui_solid_lib::run(app_state);
    //cursive::run_cursive(app_state);
    // let test_01 = app_state.service.get_entry(1).unwrap();
    // println!("debug1:{:#?}", test_01);
    // let test = app_state.service.get_snippet_list(None, None).unwrap();
    // println!("debug2:{:#?}", test);
    //ratatui::setup().unwrap();
    // xilem::run_xilem(app_state);

    // tools::parse_joplin::_parse_joplin_export(&mut service, "./data");

    // let tag_map = service.store.tag_store.borrow();
    

    // let tag_list = tag_map.iter().filter(|(&id, _)| id == 7).map(|tag_entry| *tag_entry.0).collect();
    // println!("{:?}", tag_list);
    // let list = service.get_snippet_list(Some(tag_list), None).unwrap();

    // for item in list {
    //     println!("{:#?}", item);
    // }
    //println!("{:#?}", tag_map);
    //println!("{:#?}", snippet_map);

    // let mut to_be_sorted: Vec<(&usize, &Tag)> = map.iter().map(|entry| entry).collect(); 

    // to_be_sorted.sort_by(|a, b| a.1.id.cmp(&b.1.id));
    // println!("{:#?}", to_be_sorted);


    
   //_create_dummy_hash_store(&mut service);
   //println!("{:#?}", service.store.snippet_store);
   

    

    // let _e = CreateSnippet {
        
    //     text: "some text".into(),
    //     title: "first".into(),
    //     tags: vec![],
        
    // };

    // service.store.add_entry(_e).unwrap();

    // println!("{:#?}", service.store);
}



   
   
    // let tag_count = 5;


    
   

    

    // let mut results: HashMap<usize, usize> = HashMap::new();
    // for _ in 0..100 {
    //     let choice = tag_counts.get(dist.sample(&mut rng)).unwrap().clone();
    //     //results.push(choice);
    //     results.entry(choice).and_modify(|v| *v+=1).or_insert(1);
    // }

    // let mut ordered: Vec<(usize, usize)> = results.into_iter().map(|entry| entry).collect();
    // ordered.sort_by(|a, b| a.0.cmp(&b.0));
    // println!("{:?}", ordered);
   
