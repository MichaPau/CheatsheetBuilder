pub mod db {
    pub mod sqlite {
        pub mod rusqlite;
    }
}

pub mod memory {
    pub mod hashmap_store;
}