//use std::{collections::HashMap, fs, path::{Path, PathBuf}};

use domain::{
    //entities::entry::{CreateSnippet, CreateTag}, 
    ports::ports::Service,
 };

use repository::memory::hashmap_store::HashMapStore;
//use tools;

//https://github.com/howtocodeit/hexarch
//https://www.howtocodeit.com/articles/master-hexagonal-architecture-rust#service-the-heart-of-hexagonal-architecture


fn main() {
    println!("Hello, cheatsheet builder!");

    let store = HashMapStore::new();
    let mut service = Service::new(store);

    tools::parse_joplin::_parse_joplin_export(&mut service, "./data");

    let tag_map = service.store.tag_store.borrow();
    //let snippet_map = service.store.snippet_store.borrow();

    let tag_list = tag_map.iter().filter(|(&id, _)| id == 7).map(|tag_entry| *tag_entry.0).collect();
    println!("{:?}", tag_list);
    let list = service.get_list(Some(tag_list), None).unwrap();

    for item in list {
        println!("{:#?}", item);
    }
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
   
