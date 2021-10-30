const client = require('./client');

async function getRoutineActivityById(id) {

  try{
      const {rows: [routine_activity]} = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE id=$1
    `, [id]);

      return routine_activity;

  }catch(error){
      console.error(error)
      throw error
  }
}

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

async function updateRoutineActivity({ id, count, duration }) {
    try {
      const {
        rows: [routine_activity],
      } = await client.query(
        `
          UPDATE routine_activities
          SET count=$2, duration=$3
          WHERE id=$1
          RETURNING *;
      `,
        [id, count, duration]
      );
      return routine_activity;
    } catch (err) {
      throw err;
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

    const getRoutineActivitiesByRoutine = async ({ id }) => {
        try {
          const { rows } = await client.query(
            `
              SELECT *
              FROM routine_activities
              WHERE "routineId" = $1;
            `,
            [id]
          );
      
          return rows;
        } catch (error) {
          throw error;
        }
      };

module.exports = { addActivityToRoutine, updateRoutineActivity, destroyRoutineActivity, getRoutineActivitiesByRoutine, getRoutineActivityById};