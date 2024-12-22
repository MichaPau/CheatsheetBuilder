// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use repository::types::AppState;
use tauri::Manager;

mod commands;

//#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run(app_state: AppState) {
    tauri::Builder::default()
        .setup(|app| {
            app.manage(app_state);
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::add_default_snippet,
            commands::get_categories,
            commands::get_snippets,
            commands::set_tag_parent_id,
            commands::get_parent_tags,
            commands::search_tags,
            commands::update_snippet_text,
            commands::update_snippet_title,
            commands::append_tag,
            commands::remove_tag_from_snippet,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
