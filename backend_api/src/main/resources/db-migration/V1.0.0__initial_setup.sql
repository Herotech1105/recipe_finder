CREATE TYPE unit AS ENUM (
    'ML',
    'G',
    'STK.',
    'TL',
    'EL',
    ''
    );

CREATE TYPE meal_type AS ENUM (
    'MAIN',
    'STARTER',
    'SNACK',
    'DESSERT',
    'NONE'
    );

CREATE TABLE recipes
(
    id          serial8 primary key,
    name        text      NOT NULL,
    preparation text      NOT NULL,
    author_id   serial8   NOT NULL,
    category    meal_type NOT NULL default 'NONE'
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
    user_id       serial8 NOT NULL,
    ingredient_id serial8 NOT NULL,
    amount        float   NOT NULL,
    unit          unit    NOT NULL
);

CREATE TABLE recipe_ingredients
(
    id            serial8 primary key,
    recipe_id     serial8 NOT NULL,
    ingredient_id serial8 NOT NULL,
    amount        float   NOT NULL,
    unit          unit    NOT NULL
);