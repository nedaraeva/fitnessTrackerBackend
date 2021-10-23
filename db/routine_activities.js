const client = require('./client');

async function addActivityToRoutine({routineId, activityId, count, duration}){
    try {
        const { rows: [ routine ]} = await client.query(`
        INSERT INTO routines("routineId", "activityId", count, duration)
        VALUES($1, $2, $3, $4)
        RETURNING *;
        `, [routineId, activityId, count, duration]);
        return routine;
    } catch (error){
        throw error;
    }
}

module.exports = { addActivityToRoutine};