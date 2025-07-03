// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use config_io;
use repository::{db::sqlite::rusqlite_db::Rusqlite, ports::services::Service, types::AppState};
// pub mod app_config;
// use app_config::ConfigState;

use tauri_gui_lib::app_config::ConfigState;
fn main() {
    // let dst = "../../../../../data/dev_db_backup.db";
    // match store.backup(dst) {
    //     Ok(()) => println!("backup created"),
    //     Err(e) => println!("error creatting backup: {:?}", e),
    // }
    //println!("current:{:?}", std::env::current_dir());

    match load_user_config() {
        Ok(config) => {
            let store_result = Rusqlite::open(config.db_path.clone());
            if store_result.is_ok() {
                let service = Service::new(Box::new(store_result.unwrap()));
                let app_state = AppState { service };
                tauri_gui_lib::run(app_state, config);
            } else {
                tauri_gui_lib::run_error(format!("{:?}", store_result.unwrap_err()));
            }
        }
        Err(e) => {
            tauri_gui_lib::run_error(e.to_string());
        }
    }
    /* if let Ok(config) = load_user_config() {
        let store = Rusqlite::open(config.db_path.clone()).unwrap();
        let service = Service::new(Box::new(store));
        let app_state = AppState { service };
        tauri_gui_lib::run(app_state, config);
    } else {
        tauri_gui_lib::run_error("error".into());
    } */
    // let store = Rusqlite::open("../../../../../data/dev_db.db").unwrap();
    //let mut store = Rusqlite::new_in_memory().unwrap();
    //store.create_dummy_entries().unwrap();

    /* let service = Service::new(Box::new(store));

    let app_state = AppState { service };
    let config = ConfigState {
        id: "test-config".into(),
        db_path: "some".into(),
    };

    tauri_gui_lib::run(app_state, config); */
}
fn load_user_config() -> Result<ConfigState, std::io::Error> {
    let config_obj = config_io::Config::new(("net", "michapau", "test-app"), "config.ron", None)?;
    let config_str = config_obj.read_config()?;
    match ron::de::from_str::<ConfigState>(&config_str) {
        Ok(config) => Ok(config),
        Err(e) => Err(std::io::Error::new(
            std::io::ErrorKind::Other,
            format!("{:?}", e),
        )),
    }
}
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_config() {
        let result = config_io::Config::new(("", "", "test-app"), "config.ron", None);
        match result {
            Ok(c) => {
                if let Ok(config_string) = c.read_config() {
                    let s: ConfigState = ron::de::from_str(&config_string).unwrap();
                    println!("ConfigState: {:?}", s);
                };
            }
            Err(e) => {
                println!("Error: {:?}", e);
            }
        }
    }
}
