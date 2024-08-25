
use std::collections::HashMap;

use std::ffi::OsStr;
use std::fs;


use std::path::PathBuf;

use domain::entities::entry::CreateSnippet;
//use domain::entities::entry;
//use domain::entities::entry::CreateSnippet;
use domain::entities::entry::CreateTag;
use domain::entities::entry::TagID;
//use domain::entities::entry::TagList;
use domain::entities::entry::TagType;
use domain::ports::ports::CheatsheetStore;
use domain::ports::ports::Service;
use domain::ports::ports::TagStore;
use rand::Rng;
use rand::distributions::WeightedIndex;
use rand::distributions::Distribution;
use rand::prelude::IteratorRandom;


use walkdir::WalkDir;

    
#[allow(unused)]
fn _create_dummy_hash_store() {
    


    // let path = std::env::current_dir().unwrap();
    // println!("{}", path.display());

    let tag_list = vec!["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

    let mut all_tags = vec![];

    for t in tag_list {
        let ct = CreateTag {parent: None, tag_type: domain::entities::entry::TagType::Normal, title: t.to_string()};
        //let tag = service.add_tag(ct).unwrap();
        
        all_tags.push(ct);
    }
    let tag_counts: Vec<usize> = (1..10).collect();
    let count_weights: Vec<usize> = (1..10).rev().collect();

    let dist = WeightedIndex::new(&count_weights).unwrap();

    let mut path_vec: Vec<PathBuf> = WalkDir::new("./data").into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().is_file())
        .map(|e| PathBuf::from(e.path())).collect();
    

    let mut rng = rand::thread_rng();
    for _ in 0..10 {
        let l = path_vec.len();
        let i = rng.gen_range(0..l);
        let entry = path_vec.swap_remove(i);
        //let e = entry.clone().into_os_string().into_string().unwrap();
        let e = entry.clone().file_name().unwrap().to_str().unwrap().to_string();
        let e_index = e.rfind('.').unwrap_or(e.len() -1);
        let e_name  = String::from(&e[0..e_index]);

        let content = fs::read_to_string(entry).unwrap();
        
        let choice = tag_counts.get(dist.sample(&mut rng)).unwrap();
        let tags = all_tags.iter().cloned().choose_multiple(&mut rng, *choice);

        let title = e_name;
        // let item = CreateSnippet {
        //     title,
        //     text: content,
        //     tags,
        // };

        //service.add_entry(item).unwrap();
        
    }
}

pub fn _parse_joplin_export<R>(service: &mut Service<R>, p: &str) where R: CheatsheetStore + TagStore {
    let path_vec: Vec<PathBuf> = WalkDir::new(p).into_iter().filter_map(|e| e.ok()).filter(|e| e.path().is_file()).map(|e| PathBuf::from(e.path())).collect();

    let mut tag_set: HashMap<String, usize> = HashMap::new();
    for item in path_vec {

        let p = item.strip_prefix("./data").unwrap_or(&item);
        let f_os = p.file_name().unwrap_or(&OsStr::new("undefined"));
        
        let file_name = f_os.to_owned().into_string().unwrap();


        
        let mut comp_list_temp: Vec<_> = p.components().into_iter().map(|entry|entry.as_os_str().to_owned().into_string().unwrap()).collect();
        comp_list_temp.pop();

        let mut state = String::new();
        let comp_list: Vec<_> = comp_list_temp.iter().map(|item| {
            if state.len() != 0 {
                state.push('/');
            }
            state.push_str(item);
            (item.clone(), state.clone())
        }).collect();
        
        // println!("{:?}", comp_list);

        let mut parent_tag_id: usize = 0;
        let mut tags_for_file: Vec<TagID> = vec![];
        for item in comp_list {
            if tag_set.contains_key(&item.1) {
                parent_tag_id = *tag_set.get(&item.1).unwrap();
                tags_for_file.push(parent_tag_id);
            } else {
                let t = CreateTag {
                    title: item.0,
                    tag_type: TagType::Normal,
                    parent: if parent_tag_id == 0 { None } else { Some(parent_tag_id)},
                };
                
                let tag = service.add_tag(t).unwrap();
                parent_tag_id = tag.id;
                tags_for_file.push(parent_tag_id);
                tag_set.insert(item.1, parent_tag_id);
              
            }
        }
        
        let snippet_text = match std::fs::read_to_string(item.clone()) {
            Ok(text) => text,
            Err(e) => {
                println!("Error while reading {}: {:?}",item.display(), e);
                "error rading file".into()
            },
        };
        let snippet = CreateSnippet {
            title: file_name.clone(),
            text: snippet_text.clone(),
            tags: tags_for_file,
        };

        match service.add_entry(snippet) {
            Err(e) => {
                println!("File:{:?}", file_name);
                println!("Text:{:?}", snippet_text);
                println!("Error: {:?}", e);
            }

            _ => (),
        }

        
    }

    
    // let mut title_set: HashSet<String> = HashSet::new();
    // for item in path_vec {
    //     let path_items:Vec<_> = item.components().into_iter()
    //         .filter(|c| {
    //             match c {
    //                 Component::Normal(cs) => {
    //                     if *cs == "data" {
    //                         false
    //                     } else {
    //                         true
    //                     }
    //                 }

    //                 _ => false,
    //             }
    //         })
    //         .map(|c| c.as_os_str().to_owned())
    //         .map(|n| n.into_string().unwrap())
    //         .collect();
        
    //     let mut lastId = 0;
    //     for tag_name in path_items {
    //         title_set.insert(tag_name.clone());
    //         let mut t = CreateTag {
    //             title: tag_name,
    //             tag_type: TagType::Normal,
    //             parent: None,
    //         };
            
    //         if lastId != 0 {
    //             t.parent = Some(lastId);
    //         }

        
    //         lastId = service.add_tag(t).unwrap().id;
    //     }
        
    // }
    
    
    // .filter(|e| e.path().is_file())
    // .map(|e| PathBuf::from(e.path())).collect();
}

