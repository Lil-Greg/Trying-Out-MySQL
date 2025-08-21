-- @block

CREATE TABLE IF NOT EXISTS Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT,
    username VARCHAR(255) NOT NULL UNIQUE,
    meme_id INT,
    CONSTRAINT fk_memes_id
        FOREIGN KEY (meme_id) REFERENCES Memes(id)
);

CREATE TABLE IF NOT EXISTS Memes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    img_url TEXT NOT NULL,
    creator_id INT NOT NULL,
    CONSTRAINT fk_memes_user
        FOREIGN KEY (creator_id) REFERENCES Users(id)
);
-- no trailing commas

-- @block
-- Now inserting DATA!!

INSERT INTO users(email, username, bio)
VALUES(
    'helloworld@gmail.com',
    'helloworld',
    'Hi, My Name is...'
);

-- @block

SELECT * FROM users