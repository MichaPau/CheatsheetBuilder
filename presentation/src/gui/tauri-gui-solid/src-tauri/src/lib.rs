use domain::entities::entry::{Snippet, Tag, TagType};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::{Manager, State};
use repository::types::AppState;


#[tauri::command]
fn get_categories(app_state: State<'_, AppState>) -> Vec<Tag> {
    let cat_result = app_state.service.get_tag_list(Some(TagType::Category)).unwrap();

    let cat_vec: Vec<Tag> = cat_result.iter().map(|tag| tag.clone()).collect();
    cat_vec
}

#[tauri::command]
fn get_snippets(app_state: State<'_, AppState>) -> Vec<Snippet> {
    let snippet_result = app_state.service.get_snippet_list(None, None).unwrap();

    let snippet_vec: Vec<Snippet> = snippet_result.iter().map(|s| s.clone()).collect();
    snippet_vec
}
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
            app.manage(app_state);
            Ok(())

        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, get_categories, get_snippets])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
