#![allow(dead_code)]
#![allow(unused_imports)]

use std::{env, fmt::format};

use domain::entities::entry::SnippetList;
use repository::{db::sqlite::rusqlite_db::Rusqlite, ports::{services::Service, stores::{SnippetStore, TagStore}}};

use xilem::{view::Axis, EventLoop, WidgetView, Xilem};
use xilem::view::{flex, label};

struct XilemState {
    list: SnippetList,
}
pub struct AppState<R: SnippetStore + TagStore + 'static> {
    pub service: Service<R>,
}

fn app_logic2<R: SnippetStore + TagStore>(app_state: &mut AppState<R>) -> impl WidgetView<AppState<R>> {
    println!("xilem::app_logic2");
    let snippet_list = app_state.service.get_snippet_list(None, None).unwrap();
    
    let labels = snippet_list.iter().enumerate().map(|(i, snippet)| {
        label(format!("{} - {}", i, snippet.title))
    }).collect::<Vec<_>>();

    flex(
        (
            label("this is a label"),
            labels,
        )
    ).direction(Axis::Vertical)
    .cross_axis_alignment(xilem::view::CrossAxisAlignment::Center)
    
    
}

fn app_logic(_app_state: &mut XilemState) -> impl WidgetView<XilemState> {
    println!("xilem::app_logic");
    label("this is a label")
    
}

pub fn run_xilem() {
    env::set_var("RUST_LOG", "warn");
    
    let store = Rusqlite::new_in_memory().unwrap();
    let service = Service::new(store);
    let state = AppState {
        service,
    };
    let app = Xilem::new(state, app_logic2);
        //.background_color(Color {r: 200, g: 200, b: 200, a: 200});
    
    app.run_windowed(EventLoop::with_user_event(), "Test".into()).unwrap();
}