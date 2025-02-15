// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use repository::{db::sqlite::rusqlite_db::Rusqlite, ports::services::Service, types::AppState};

fn main() {


    // let dst = "../../../../../data/dev_db_backup.db";
    // match store.backup(dst) {
    //     Ok(()) => println!("backup created"),
    //     Err(e) => println!("error creatting backup: {:?}", e),
    // }
    //println!("current:{:?}", std::env::current_dir());
    let store = Rusqlite::open("../../../../../data/dev_db.db").unwrap();
    //let mut store = Rusqlite::new_in_memory().unwrap();
    //store.create_dummy_entries().unwrap();

    let service = Service::new(Box::new(store));

    let app_state = AppState { service };

    tauri_gui_lib::run(app_state);
}
