const express = require('express');
const activitiesRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET = 'neverTell' } = process.env;

const {getAllActivities, createActivity, updateActivity, getPublicRoutinesByActivity} = require("../db")

activitiesRouter.get("/", async (req, res, next) => {
    try {
      const activities = await getAllActivities();
      res.send(activities);
    } catch (error) {
      next(error);
    }
  });

  activitiesRouter.post("/", async (req, res, next) => {
    const { name, description } = req.body;
    try {
      if (req.headers.authorization) {
        const [, token] = req.headers.authorization.split("Bearer ");
        const validatedToken = jwt.verify(token, JWT_SECRET);
  
        if (validatedToken) {
          const activity = await createActivity({ name, description });
          res.send(activity);
        } else {
          res.status(403).send({ message: `Invalid Password or Username` });
        }
      } else {
        res.status(403).send({ message: `Invalid Password or Username` });
      }
    } catch (error) {
      next(error);
    }
  });

  activitiesRouter.patch("/:activityId", async (req, res, next) => {
    const { name, description } = req.body;
    const { activityId } = req.params;
    try {
      if (req.headers.authorization) {
        const [, token] = req.headers.authorization.split("Bearer ");
        const validatedToken = jwt.verify(token, JWT_SECRET);
  
        if (validatedToken) {
          const activity = await updateActivity({
            id: activityId,
            name,
            description,
          });
          res.send(activity);
        } else {
          res.status(403).send({ message: `Invalid Password or Username` });
        }
      } else {
        res.status(403).send({ message: `Invalid Password or Username` });
      }
    } catch (error) {
      next(error);
    }
  });
  
  activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
      const { activityId } = req.params;
  
    try {
      const publicRoutines = await getPublicRoutinesByActivity({
        id: activityId,
      });
      res.send(publicRoutines);
    } catch (error) {
      next(error);
    }
  });

module.exports = activitiesRouter;