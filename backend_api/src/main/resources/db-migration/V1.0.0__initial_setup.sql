CREATE TYPE unit AS ENUM
    (
        'ml',
        'g',
        'Stk.',
        'TL',
        'EL',
        ''
        );

CREATE TABLE recipes
(
    id          serial8 primary key,
    name        text    NOT NULL,
    preparation text    NOT NULL,
    author_id   serial8 NOT NULL
);

CREATE TABLE ingredients
(
    id   serial8 primary key,
    name text NOT NULL
);

CREATE TABLE users
(
    id       serial8 primary key,
    name     text NOT NULL,
    password text NOT NULL
);

CREATE TABLE storage
(
    id            serial8 primary key,
    user_id       serial8,
    ingredient_id serial8,
    amount        float,
    unit          unit
);

CREATE TABLE recipe_ingredients
(
    id            serial8 primary key,
    recipe_id     serial8 NOT NULL,
    ingredient_id serial8 NOT NULL,
    amount        float   NOT NULL,
    unit          unit    NOT NULL
);