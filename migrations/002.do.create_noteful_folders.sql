CREATE TABLE public.noteful_folders
(
    id integer NOT NULL,
    name text NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public.noteful_folders
    OWNER to dunder_mifflin;