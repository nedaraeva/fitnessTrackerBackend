const client = require('./client');

async function addActivityToRoutine({routineId, activityId, count, duration}){
    try {
        const { rows: [ routine ]} = await client.query(`
        INSERT INTO routine_activities("routineId", "activityId", count, duration)
        VALUES($1, $2, $3, $4)
        ON CONFLICT ("routineId", "activityId")
        DO NOTHING
        RETURNING *;
        `, [routineId, activityId, count, duration]);
        return routine;
    } catch (error){
        throw error;
    }
}

async function destroyRoutineActivity(id) {

    try {
       const {rows:[routine_actvities]} = await client.query(`
        DELETE FROM routine_activities
        WHERE id = $1 
        RETURNING *;
      `, [id])
    
    return routine_actvities;

    } catch(error) {
      console.log(error)
      throw error
    }
    }

module.exports = { addActivityToRoutine, destroyRoutineActivity};