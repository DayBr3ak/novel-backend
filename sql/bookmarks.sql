drop table if exists bookmarks;
create table bookmarks (
  id serial primary key
  , name text not null
  , reference text not null
  , chapter text not null
  , slug text not null
  , website text not null
);