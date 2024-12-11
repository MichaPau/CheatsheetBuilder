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
            commands::greet,
            commands::get_categories,
            commands::get_snippets,
            commands::set_tag_parent_id,
            commands::get_parent_tags
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
