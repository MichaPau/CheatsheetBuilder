#[cfg(feature = "tui_ratatui")]
pub mod tui {
    pub mod ratatui {
        pub mod ratatui;
    }
}

#[cfg(feature = "tui_cursive")]
pub mod tui {
    pub mod cursive {
        pub mod cursive;
    }
}

#[cfg(feature = "gui_xilem")]
pub mod gui {
    pub mod xilem {
        pub mod xilem;
        //pub mod xilem_web;
    } 
}
// #[cfg(feature = "gui_tauri")]

// pub mod gui {
//     pub mod tauri_gui {
//         pub use tauri_gui_solid_lib;

        
        
//     }
// }