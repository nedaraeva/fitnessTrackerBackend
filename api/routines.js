const express = require('express');
const routinesRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET = 'neverTell' } = process.env;


module.exports = routinesRouter;