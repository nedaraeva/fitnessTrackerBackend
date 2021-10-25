const client = require('./client');

async function addActivityToRoutine({routineId, activityId, count, duration}){
    try {
        const { rows: [ routine ]} = await client.query(`
        INSERT INTO routines_activities("routineId", "activityId", count, duration)
        VALUES($1, $2, $3, $4)
        RETURNING *;
        `, [routineId, activityId, count, duration]);
        return routine;
    } catch (error){
        throw error;
    }
}

async function destroyRoutineActivity(id) {

    try {
      await client.query(`
        DELETE FROM routines_activities
        WHERE id = $1;
      `, [id])
    
    } catch(error) {
      console.log(error)
      throw error
    }
    }

module.exports = { addActivityToRoutine, destroyRoutineActivity};