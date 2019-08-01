const express = require("express");
const Posts = require("../data/db");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const posts = await Posts.find(req.query);
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errorMessage: "The posts information could not be retrieved."
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The post information could not be retrieved." });
    }
});

router.get("/:id/comments", async (req, res) => {
    try {
        const comments = await Posts.findPostComments(req.params.id);
        if (comments) {
            res.status(200).json(comments);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The comments information could not be retrieved." });
    }
});

router.post("/", async (req, res) => {
    try {
        const post = await Posts.insert(req.body);
        if (!req.body.title || !req.body.contents) {
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
        }
        res.status(201).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "There was an error while saving the post to the database." });
    }
});

router.post("/:id/comments", async (req, res) => {
    try {
        const post_id = req.params.id;
        const { text } = req.body;

        if (!text) {
            res.status(400).json({ errorMessage: "Please provide text for the comment." });
        } else {
            await Posts.insertComment({ text, post_id })
                .then(comment => {
                    if (comment) {
                        res.status(200).json({ success: true, comment });
                    } else {
                        res.status(404).json({ message: "The post with the specified ID doesn't exist." });
                    }
                })
        }  
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "There was an error while saving the comment to the database." });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const count = await Posts.remove(req.params.id);
        if (count > 0) {
            res.status(200).json({ message: "The post has been removed." });
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The post could not be removed." });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const post = await Posts.update(req.params.id, req.body);
        if (!req.body.title || !req.body.contents) {
            res.status(400).json({ message: "Please provide title and contents for the post." });
        } else if (post) {
            res.status(200).json({ id: req.params.id, ...req.body });
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The post information could not be modified." });
    }
});

module.exports = router;