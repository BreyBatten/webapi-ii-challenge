const express = require("express");
const postsRouter = require("./posts/posts-router");
const server = express();

server.use(express.json());
server.use('/api/posts', postsRouter);

server.get("/", (req, res) => {
    res.send(`
        <h3>Posts API</h3>
    `);
});

module.exports = server;