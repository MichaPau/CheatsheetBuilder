#[cfg(feature = "serde")]
use serde::Serialize;
use std::time::SystemTime;
//use crate::entities::entry::{Tag, TagID, TagList};

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[cfg_attr(feature = "serde", derive(Serialize))]
pub struct Timestamp(u64);

impl std::fmt::Display for Timestamp {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl From<u64> for Timestamp {
    fn from(value: u64) -> Self {
        Self(value)
    }
}

impl From<Timestamp> for u64 {
    fn from(value: Timestamp) -> u64 {
        value.0
    }
}

impl Timestamp {
    pub fn from_utc_now() -> Self {
        Self(
            SystemTime::now()
                .duration_since(SystemTime::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
        )
    }
}

/* #[cfg_attr(feature = "serde", derive(Deserialize))]
#[derive(Debug)]
pub struct SearchPattern {
    pub search_type: SearchType,
    pub pattern: String,
}

#[cfg_attr(feature = "serde", derive(Deserialize))]
#[derive(Debug)]
pub enum SearchType {
    StartWith,
    EndWith,
    Contains,
} */
