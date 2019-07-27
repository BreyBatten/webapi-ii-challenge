const express = require("express");
const Posts = require("../data/db");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const posts = await Posts.find(req.query);
        res.status(200).json(hubs);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errorMessage: "The posts information could not be retrieved."
        });
    }
});