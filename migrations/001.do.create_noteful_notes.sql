CREATE TABLE public.noteful_notes
(
    id integer NOT NULL,
    name text NOT NULL,
    modified timestamp with time zone NOT NULL,
    folder_id integer NOT NULL,
    content text NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public.noteful_notes
    OWNER to dunder_mifflin;