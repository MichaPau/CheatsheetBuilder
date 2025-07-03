use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct ConfigState {
    pub id: String,
    pub db_path: String,
}
