use domain::entities::entry::{Snippet, Tag, TagType};
use repository::{errors::CheatsheetError, types::AppState};
use tauri::{Manager, State};

#[tauri::command]
pub fn get_categories(app_state: State<'_, AppState>) -> Result<Vec<Tag>, CheatsheetError> {
    match app_state.service.get_tag_list(Some(TagType::Category)) {
        Ok(result) => Ok(result.inner),
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub fn set_tag_parent_id(
    tag_id: usize,
    new_parent_id: Option<usize>,
    app_state: State<'_, AppState>,
) -> Result<bool, CheatsheetError> {
    app_state.service.update_tag_parent(tag_id, new_parent_id)
}
#[tauri::command]
pub fn get_snippets(app_state: State<'_, AppState>) -> Result<Vec<Snippet>, CheatsheetError> {
    app_state.service.get_snippet_list(None, None)
    // let snippet_result = app_state.service.get_snippet_list(None, None).unwrap();

    // let snippet_vec: Vec<Snippet> = snippet_result.iter().map(|s| s.clone()).collect();
    // snippet_vec
}

#[tauri::command]
pub fn greet(name: &str, app_handle: tauri::AppHandle) -> String {
    let state: State<'_, AppState> = app_handle.state();
    let s = state.service.get_snippet_list(None, None).unwrap();
    println!("Debug store: {:?}", s);
    format!(
        "Hello, {}! You've been greeted from Rust! testSnippet: {:?}",
        name, s[0].title
    )
}
