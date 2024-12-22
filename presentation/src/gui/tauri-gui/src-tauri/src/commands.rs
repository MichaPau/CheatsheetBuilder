use domain::entities::entry::{CreateSnippet, Snippet, SnippetID, Tag, TagType};
use repository::{errors::CheatsheetError, types::AppState};
use tauri::State;

#[tauri::command]
pub fn add_default_snippet(app_state: State<'_, AppState>) -> Result<Snippet, CheatsheetError> {
    app_state.service.add_entry(CreateSnippet::default())
}
#[tauri::command]
pub fn update_snippet_title(
    id: SnippetID,
    new_title: String,
    app_state: State<'_, AppState>,
) -> Result<bool, CheatsheetError> {
    app_state.service.update_title(id, new_title)
}
#[tauri::command]
pub fn update_snippet_text(
    id: SnippetID,
    new_text: String,
    app_state: State<'_, AppState>,
) -> Result<bool, CheatsheetError> {
    app_state.service.update_text(id, new_text)
}

#[tauri::command]
pub fn append_tag(
    snippet_id: usize,
    tag_id: usize,
    app_state: State<'_, AppState>,
) -> Result<Vec<Tag>, CheatsheetError> {
    match app_state.service.append_tag(snippet_id, tag_id) {
        Ok(_) => app_state.service.get_tags_for_snippet(snippet_id),
        Err(e) => Err(e),
    }
}
#[tauri::command]
pub fn remove_tag_from_snippet(
    snippet_id: usize,
    tag_id: usize,
    app_state: State<'_, AppState>,
) -> Result<Vec<Tag>, CheatsheetError> {
    match app_state.service.remove_tag(snippet_id, tag_id) {
        Ok(_) => app_state.service.get_tags_for_snippet(snippet_id),
        Err(e) => Err(e),
    }
}
#[tauri::command]
pub fn get_categories(app_state: State<'_, AppState>) -> Result<Vec<Tag>, CheatsheetError> {
    match app_state.service.get_tag_list(Some(TagType::Category)) {
        Ok(result) => Ok(result.inner),
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub fn get_parent_tags(
    tag_id: usize,
    app_state: State<'_, AppState>,
) -> Result<Vec<Tag>, CheatsheetError> {
    match app_state.service.get_tag_hierarchy(tag_id) {
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
pub fn search_tags(
    pattern: &str,
    app_state: State<'_, AppState>,
) -> Result<Vec<Tag>, CheatsheetError> {
    match app_state
        .service
        .search_tags_by_title(pattern, domain::entities::entry::SearchMode::Contains)
    {
        Ok(result) => Ok(result.inner),
        Err(e) => Err(e),
    }
}
#[tauri::command]
pub fn get_snippets(app_state: State<'_, AppState>) -> Result<Vec<Snippet>, CheatsheetError> {
    let r = app_state.service.get_snippet_list(None, None);
    //println!("{:?}", r);
    r
    // let snippet_result = app_state.service.get_snippet_list(None, None).unwrap();

    // let snippet_vec: Vec<Snippet> = snippet_result.iter().map(|s| s.clone()).collect();
    // snippet_vec
}
