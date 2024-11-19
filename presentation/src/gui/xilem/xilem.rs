#![allow(dead_code)]
#![allow(unused_imports)]

use std::{env, fmt::format, slice::Windows, sync::Mutex};

use domain::entities::entry::SnippetList;
use repository::{db::sqlite::rusqlite_db::Rusqlite, ports::{services::Service, stores::{SnippetStore, TagStore}}, types::StateTrait};

use xilem::{dpi::LogicalSize, view::{sized_box, Axis}, EventLoop, WidgetView, Xilem};
use xilem::view::{flex, label, portal};

use winit::window::Window;

// pub trait StateTrait: SnippetStore + TagStore + 'static {}
// impl<T> StateTrait for T
//     where T: SnippetStore + TagStore + 'static {}

// pub struct AppState<R> where R: StateTrait {
//     pub service: Service<R>,
// }
pub struct AppState<R> where R: StateTrait {
    pub service: Service<R>,
}

fn app_logic2<R: StateTrait>(app_state: &mut AppState<R>) -> impl WidgetView<AppState<R>> {
    println!("xilem::app_logic2a");

    let snippet_list2 = app_state.service.get_snippet_list(None, None).unwrap();
    //let snippet_list = vec!["one", "two", "three"];
    
    let labels = snippet_list2.iter().enumerate().map(|(i, snippet)| {
        label(format!("{} - {}", i, snippet.title))
    }).collect::<Vec<_>>();

    sized_box(
    flex((
        flex(
            label("left pane"),
        ),
        flex((
            label("right pane"),
            labels,
        )
    ))).direction(Axis::Horizontal).must_fill_major_axis(true).cross_axis_alignment(xilem::view::CrossAxisAlignment::Fill)
    ).expand_height().expand_width()
}

// struct XilemState {
//     list: SnippetList,
// }
// fn app_logic(_app_state: &mut XilemState) -> impl WidgetView<XilemState> {
//     println!("xilem::app_logic");
//     label("this is a label")
    
// }

pub fn run_xilem<R: StateTrait>(app_state: AppState<R>) {
    env::set_var("RUST_LOG", "DEBUG");
    
    // let store = Rusqlite::new_in_memory().unwrap();
    // let service = Service::new(store);
    // let state = AppState {
    //     service,
    // };
    let app = Xilem::new(app_state, app_logic2);
        //.background_color(Color {r: 200, g: 200, b: 200, a: 200});
    
    let win_size = LogicalSize::new(1200, 737);
    let win_config = Window::default_attributes()
        .with_title("Test")
        .with_inner_size(win_size);
    //app.run_windowed(EventLoop::with_user_event(), "Test".into()).unwrap();
    app.run_windowed_in(EventLoop::with_user_event(), win_config).unwrap();
}