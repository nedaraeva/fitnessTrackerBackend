const express = require('express');
const routine_activitiesRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET = 'neverTell' } = process.env;

module.exports = routine_activitiesRouter;