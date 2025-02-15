#[cfg(feature= "serde")]
use serde::Serialize;

#[derive(Debug, PartialEq)]
#[non_exhaustive]
#[cfg_attr(feature = "serde", derive(Serialize))]
pub enum CheatsheetError {
    SnippetError,
    StoreError(String),
    CreateSnippetError,
    CreateTagError(String),
    TagError,
    SnippetListError,
    UnknownError,
    NotImplemented(String),
}
