#[derive(Debug, PartialEq)]
#[non_exhaustive]
pub enum CheatsheetError {
    SnippetError,
    StoreError(String),
    CreateSnippetError,
    TagError,
    SnippetListError,
    UnknownError,
    NotImplemented(String),
}

