use tauri::{menu::{Menu, SubmenuBuilder}, AppHandle, Runtime};

// https://github.com/gitbutlerapp/gitbutler/blob/master/crates/gitbutler-tauri/src/menu.rs
//
// .menu(menu::build)
pub fn build<R: Runtime>(handle: &AppHandle<R>) -> tauri::Result<tauri::menu::Menu<R>> {
    let test_menu = &SubmenuBuilder::new(handle, "Test")
        .text("test/test1", "Test1")
        .text("test/test2", "Test2")
        .build()?;
    Menu::with_items(handle, &[test_menu])
}
