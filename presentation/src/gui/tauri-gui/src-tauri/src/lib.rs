// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use repository::types::AppState;
use tauri::Manager;

pub mod commands;
pub mod menu;
pub mod app_config;
use app_config::ConfigState;
//use tauri_gui_lib::app_config::ConfigState;

//#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run(app_state: AppState, config_state: ConfigState) {
    tauri::Builder::default()
        .setup(|app| {
            app.manage(app_state);
            app.manage(config_state);
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::test_invoke,
            commands::load_config,
            commands::add_default_snippet,
            commands::get_categories,
            commands::get_snippets,
            commands::set_tag_parent_id,
            commands::get_parent_tags,
            commands::search_tags,
            commands::update_snippet_text,
            commands::update_snippet_title,
            commands::append_tag,
            commands::create_tag,
            commands::remove_tag_from_snippet,
            commands::get_snippet_count_for_tag,
            commands::update_tag_title,
            commands::create_category,
            commands::delete_category,
            commands::create_snippet,
            commands::delete_snippet,
        ])
        .menu(menu::build)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
