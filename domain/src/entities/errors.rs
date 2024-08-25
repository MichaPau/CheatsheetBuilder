#[derive(Debug)]
#[non_exhaustive]
pub enum CheatsheetError {
    SnippetError,
    CreateSnippetError,
    TagError,
    SnippetListError,
    UnknownError,
    NotImplemented(String),
}