BEGIN;

CREATE TABLE IF NOT EXISTS Snippet (
    snippet_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    text_type INTEGER DEFAULT 0 NOT NULL,
    created_at INTEGER DEFAULT (unixepoch ()) NOT NULL,
    updated_at INTEGER DEFAULT (unixepoch ()) NOT NULL
);

CREATE TABLE IF NOT EXISTS Tag (
    tag_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    parent_id INTEGER,
    tag_type INTEGER,
    tag_color INTEGER,
    created_at INTEGER DEFAULT (unixepoch ()) NOT NULL,
    updated_at INTEGER DEFAULT (unixepoch ()) NOT NULL
);

CREATE TABLE IF NOT EXISTS Snippet_Tags (
    id INTEGER PRIMARY KEY,
    snippet_id INTEGER NOT NULL,
    tag_id INTEGER,
    FOREIGN KEY (snippet_id) REFERENCES Snippet (snippet_id),
    FOREIGN KEY (tag_id) REFERENCES Tag (tag_id),
    UNIQUE (snippet_id, tag_id) ON CONFLICT IGNORE
);

CREATE TABLE IF NOT EXISTS CheatsheetItem (
    item_id INTEGER PRIMARY KEY,
    ordering INTEGER,
    snippet_id INTEGER NOT NULL,
    FOREIGN KEY (snippet_id) REFERENCES Snippet (snippet_id)
);

CREATE TABLE IF NOT EXISTS Cheatsheet (
    sheet_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch ()) NOT NULL,
    updated_at INTEGER DEFAULT (unixepoch ()) NOT NULL
);

CREATE TABLE IF NOT EXISTS Sheet_Items (
    id INTEGER PRIMARY KEY,
    sheet_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    FOREIGN KEY (sheet_id) REFERENCES Cheatsheet (sheet_id),
    FOREIGN KEY (item_id) REFERENCES CheatsheetItem (item_id),
    UNIQUE (sheEt_id, item_id) ON CONFLICT IGNORE
);

COMMIT;
