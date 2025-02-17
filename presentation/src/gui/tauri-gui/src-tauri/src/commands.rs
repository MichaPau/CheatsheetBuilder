use domain::entities::entry::{CreateSnippet, CreateTag, Snippet, SnippetID, Tag, TagList, TagType};
use repository::{errors::CheatsheetError, types::AppState};
use tauri::State;

#[tauri::command]
pub fn add_default_snippet(app_state: State<'_, AppState>) -> Result<Snippet, CheatsheetError> {
    app_state.service.add_entry(CreateSnippet::default())
}

#[tauri::command]
pub fn create_snippet(title: String, text: String, text_type: String, tag_ids: Vec<usize>, app_state: State<'_, AppState>) -> Result<Snippet, CheatsheetError> {
    let tags =
        tag_ids.into_iter()
            .map(|id| app_state.service.get_tag(id))
            .collect::<Result<Vec<_>, _>>()?;
    let entry: CreateSnippet = CreateSnippet::new(title, text, text_type.as_str().into(), tags);
    app_state.service.add_entry(entry)
}
#[tauri::command]
pub fn delete_snippet(id: usize, app_state: State<'_, AppState>) -> Result<Snippet, CheatsheetError> {
    app_state.service.delete_entry(id)
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
    text_type: String,
    app_state: State<'_, AppState>,
) -> Result<bool, CheatsheetError> {
    app_state.service.update_text(id, new_text, text_type.as_str().into())
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
pub fn update_tag_title(
    tag_id: usize,
    new_title: String,
    app_state: State<'_, AppState>,
) -> Result<bool, CheatsheetError> {
    app_state.service.update_tag_title(tag_id, new_title)
}

#[tauri::command]
pub fn create_category(
    parent_id: Option<usize>,
    title: String,
    app_state: State<'_, AppState>,
) -> Result<Tag, CheatsheetError> {
    let tag: CreateTag = CreateTag {
        parent_id,
        title,
        tag_type: TagType::Category,
        tag_style: None,
    };
    let new_tag = app_state.service.add_tag(tag);
    new_tag
}
#[tauri::command]
pub fn create_tag(
    title: String,
    app_state: State<'_, AppState>,
) -> Result<Tag, CheatsheetError> {
    let tag: CreateTag = CreateTag {
        parent_id : None,
        title,
        tag_type: TagType::Normal,
        tag_style: None,
    };
    let new_tag = app_state.service.add_tag(tag);
    new_tag
}
#[tauri::command]
pub fn get_snippet_count_for_tag(
    tag_id: usize,
    app_state: State<'_, AppState>,
) -> Result<usize, CheatsheetError> {
    app_state.service.get_snippet_count_for_tag(tag_id)
}
#[tauri::command]
pub fn delete_category(tag_id: usize, app_state: State<'_, AppState>) -> Result<Tag, CheatsheetError> {
    app_state.service.delete_tag(tag_id)
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
    //println!("Snippets: {:?}", r);
    r
    // let snippet_result = app_state.service.get_snippet_list(None, None).unwrap();

    // let snippet_vec: Vec<Snippet> = snippet_result.iter().map(|s| s.clone()).collect();
    // snippet_vec
}
