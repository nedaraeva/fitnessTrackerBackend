const express = require('express');
const routine_activitiesRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET = 'neverTell' } = process.env;
const {requireuser} = require('./ulities')


const { updateRoutineActivity, getRoutineActivityById, destroyRoutineActivity, getRoutineById} = require("../db")


routine_activitiesRouter.patch("/:routineActivityId", requireuser, async (req, res, next) => {
    const { count, duration} = req.body;
    const { routineActivityId } = req.params;
    const creatorId = req.user.id;

    try {
        const UpdateRoutineActivities = await getRoutineActivityById (routineActivityId);
        console.log ("!!", UpdateRoutineActivities.routineId);
        const Routine =  await getRoutineById (UpdateRoutineActivities.routineId)

    if (creatorId !== Routine.creatorId){
        res.status(401)
        next({name:"Routine Activity Id Error" , message: "Your Id does not match this routine activity" })
        
    }

    else{
        const routines = await updateRoutineActivity({id: routineActivityId, count, duration});

        res.send(routines);

    }

    } catch (error) {
        next(error)
    }
    }); 
    
    routine_activitiesRouter.delete('/:routineActivityId', requireuser, async (req, res, next) => {
        const { routineActivityId } = req.params;
        const creatorId = req.user.id;

        try {
            const UpdateRoutineActivities = await getRoutineActivityById (routineActivityId);
            console.log ("!!", UpdateRoutineActivities.routineId);
            const Routine =  await getRoutineById (UpdateRoutineActivities.routineId)
    
        if (creatorId !== Routine.creatorId){
            res.status(401)
            next({name:"Routine Activity Id Error" , message: "Your Id does not match this routine activity" })
            
        }
        
        else{
            const ReplacedRoutineActivity = await destroyRoutineActivity(routineActivityId);
            res.send(ReplacedRoutineActivity);

        }

        } catch (error) {
            next(error)
        }
        });

module.exports = routine_activitiesRouter;