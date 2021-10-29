const express = require('express');
const routinesRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET = 'neverTell' } = process.env;
const {requireuser} = require('./ulities')

const {getAllPublicRoutines, createRoutine, getRoutineById, updateRoutine, destroyRoutine, addActivityToRoutine, getRoutineActivitiesByRoutine, updateActivity} = require("../db")

routinesRouter.get("/", async (req, res, next) => {
    try {
      const routines = await getAllPublicRoutines();
      res.send(routines);
    } catch (error) {
      next(error);
    }
  });

routinesRouter.post('/', requireuser, async (req, res, next) => {
    const { isPublic, name, goal} = req.body;
    

    const creatorId = req.user.id;

	try {
	    const routines = await createRoutine({creatorId, isPublic, name, goal});
	    res.send(routines);
	} catch (error) {
	    next(error)
	}
    });  

    routinesRouter.patch("/:routineId", requireuser, async (req, res, next) => {
        const { isPublic, name, goal} = req.body;
        const { routineId } = req.params;
        const creatorId = req.user.id;

        try {
            const routinestoUpdate = await getRoutineById (routineId);
        if (creatorId !== routinestoUpdate.creatorId){
            res.status(401)
            next({name:"Routine Id Error" , message: "Your Id does not match this routine" })
        }

        else{
            const routines = await updateRoutine({id: routineId, isPublic, name, goal});

            res.send(routines);

        }

        } catch (error) {
            next(error)
        }
        });  

        routinesRouter.delete('/:routineId', async (req, res, next) => {
            const { routineId } = req.params;
            
            try {
                const ReplacedRoutine = await destroyRoutine(routineId);
                res.send(ReplacedRoutine);
            } catch (error) {
                next(error)
            }
            });
    
            routinesRouter.post('/:routineId/activities', requireuser, async (req, res, next) => {
                const { activityId, count, duration} = req.body;
                const routineId = req.params.routineId;
            
                try {
                    const UpdatedRoutineActivities = await getRoutineActivitiesByRoutine({id : routineId});
                 
                    const MatchingActivities = UpdatedRoutineActivities.filter(activity => activity.activityId === activityId);
                    


                    if (MatchingActivities.length){
                        res.status(401)
                        next({name:"Routine Id Error" , message: "Your Id does not match this routine" })
                    }
            
                    else{
                        const newActivityRoutine = await addActivityToRoutine({routineId, activityId, count, duration});
                    res.send(newActivityRoutine);
            
                    }
                } catch (error) {
                    next(error)
                }
                });  
        

module.exports = routinesRouter;