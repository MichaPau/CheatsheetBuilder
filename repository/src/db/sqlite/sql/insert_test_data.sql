BEGIN;

INSERT INTO Tag (tag_id, title, tag_type) VALUES (1, "one", 2);
INSERT INTO Tag (tag_id, title, tag_type) VALUES (2, "two", 2);
INSERT INTO Tag (tag_id, title, tag_type) VALUES (3, "three", 2);

INSERT INTO Tag (tag_id, title, tag_type, parent_id) VALUES (11, "one_sub1", 2, 1);
INSERT INTO Tag (tag_id, title, tag_type, parent_id) VALUES (12, "one_sub2", 2, 1);
INSERT INTO Tag (tag_id, title, tag_type, parent_id) VALUES (13, "one_sub3", 2, 1);

INSERT INTO Tag (tag_id, title, tag_type, parent_id) VALUES (111, "one_sub1_sub1", 2, 11);

INSERT INTO Tag (tag_id, title, tag_type, parent_id) VALUES (21, "two_sub1", 2, 2);

INSERT INTO Tag (tag_id, title, tag_type) VALUES (91, "tag1", 1);
INSERT INTO Tag (tag_id, title, tag_type) VALUES (92, "tag2", 1);
INSERT INTO Tag (tag_id, title, tag_type) VALUES (93, "tag3", 1);

INSERT INTO Snippet (snippet_id, title, text) VALUES (1, "Snippet1", "Snippet1Content");
INSERT INTO Snippet (snippet_id, title, text) VALUES (2, "Snippet2", "Snippet2Content");
INSERT INTO Snippet (snippet_id, title, text) VALUES (3, "Snippet3", "Snippet3Content");

INSERT INTO Snippet_Tags (id, snippet_id, tag_id) VALUES (1, 1, 1);
INSERT INTO Snippet_Tags (id, snippet_id, tag_id) VALUES (2, 2, 2);
INSERT INTO Snippet_Tags (id, snippet_id, tag_id) VALUES (3, 3, 3);

INSERT INTO Snippet_Tags (id, snippet_id, tag_id) VALUES (4, 1, 91);
INSERT INTO Snippet_Tags (id, snippet_id, tag_id) VALUES (5, 1, 92);
COMMIT;
