use std::io;

use ratatui::{
    crossterm::event::{self, KeyCode, KeyEventKind},
    style::Stylize,
    widgets::Paragraph,
    DefaultTerminal,
};
use repository::{db::sqlite::rusqlite_db::Rusqlite, ports::{services::Service, stores::{SnippetStore, TagStore}}};

pub struct AppState<R: SnippetStore + TagStore> {
    pub service: Service<R>,
}

pub fn setup() -> io::Result<()> {
    let store = Rusqlite::new_in_memory().unwrap();
    let service = Service::new(store);
    let state = AppState {
        service,
    };

    
    let mut terminal = ratatui::init();
    terminal.clear()?;
    let app_result = run(terminal, state);
    ratatui::restore();
    app_result
   
}

fn run<R: SnippetStore + TagStore>(mut terminal: DefaultTerminal, _app_state: AppState<R>) -> io::Result<()> {

    let list = _app_state.service.get_snippet_list(None, None).unwrap();

    let title_list: Vec<String> = list.iter().map(|item| item.title.clone()).collect();
    let text = title_list.join("\n");
    println!("{}", text);
    loop {
        terminal.draw(|frame| {
            let greeting = Paragraph::new(text.clone())
                .white()
                .on_blue();
            frame.render_widget(greeting, frame.area());
        })?;

        if let event::Event::Key(key) = event::read()? {
            if key.kind == KeyEventKind::Press && key.code == KeyCode::Char('q') {
                return Ok(());
            }
        }
    }
}
pub fn test_function() {
    println!("prensentation::tui::ratatui");
}