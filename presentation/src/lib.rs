#[cfg(feature = "tui")]
pub mod tui {
    pub mod ratatui {
        pub mod ratatui;
    }
}

#[cfg(feature = "gui")]
pub mod gui {
    pub mod xilem {
        pub mod xilem;
    } 
}