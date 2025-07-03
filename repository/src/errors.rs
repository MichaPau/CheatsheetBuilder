#[cfg(feature = "serde")]
use serde::Serialize;

#[derive(Debug, PartialEq)]
#[non_exhaustive]
#[cfg_attr(feature = "serde", derive(Serialize))]
pub enum CheatsheetError {
    #[serde(skip_serializing)]
    RusqliteError(rusqlite::Error),
    SnippetError,
    StoreError(String),
    CreateSnippetError,
    CreateTagError(String),
    TagError,
    SnippetListError,
    UnknownError,
    NotImplemented(String),
}

impl From<rusqlite::Error> for CheatsheetError {
    fn from(err: rusqlite::Error) -> Self {
        CheatsheetError::RusqliteError(err)
    }
}
