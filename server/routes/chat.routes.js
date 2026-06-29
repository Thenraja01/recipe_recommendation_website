const express = require("express");
const router = express.Router();

const { chat } = require("../controllers/chat.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js"); // use your auth middleware

router.post("/", authMiddleware, chat);

module.exports = router;