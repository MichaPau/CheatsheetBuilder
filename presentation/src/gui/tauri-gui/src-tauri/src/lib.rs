use repository::types::AppState;
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//use repository::{db::sqlite::rusqlite_db::Rusqlite, ports::{services::Service, stores::{SnippetStore, StateTrait, TagStore}}, types::AppState};
use tauri::{Manager, State};

// pub struct AppState<R> where R: StateTrait  {
//     pub service: Service<R>,
// }

// pub struct AppState  {
//     pub service: Box<dyn StateTrait>,
// }

#[tauri::command]
fn greet(name: &str, app_handle: tauri::AppHandle) -> String {

    let state: State<'_, AppState> = app_handle.state();
    let s = state.service.get_snippet_list(None, None).unwrap();
    println!("Debug store: {:?}", s);
    format!("Hello, {}! You've been greeted from Rust! testSnippet: {:?}", name, s[0].title)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run(app_state: AppState) {
    tauri::Builder::default()
        .setup(|app| {
            // let store = Rusqlite::new_in_memory().unwrap();
            // let service: Box<dyn StateTrait> = Box::new(Service::new(store)) as Box<dyn StateTrait>;

            // let app_state: Box<AppState<dyn StateTrait>> = Box::new(AppState {
            //     service,
            //);

            app.manage(app_state);
            Ok(())

        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
