// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use repository::{db::sqlite::rusqlite_db::Rusqlite, ports::services::Service, types::AppState};

fn main() {
    let store = Rusqlite::new_in_memory().unwrap();
    let service = Service::new(Box::new(store));

    let app_state = AppState {
        service,
    };

    tauri_gui_lib::run(app_state);
}
