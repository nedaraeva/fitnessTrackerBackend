const client = require('./client');

async function createRoutine({ creatorId, isPublic, name, goal  }) {
    try {
      const {
        rows: [activity],
      } = await client.query(`
        INSERT INTO routines("creatorId", "isPublic", name, goal)
        VALUES($1, $2, $3, $4)
        RETURNING *;
      `,
        [creatorId, isPublic, name, goal]
      );

      return activity;
    } catch (error) {
      throw error;
    }
  }

  async function getRoutineById(id) {

    try{
        const {rows: [routine]} = await client.query(`
        SELECT *
        FROM routines
        WHERE id=$1
      `, [id]);

        return routine;

    }catch(error){
        console.error(error)
        throw error
    }
}

async function getAllRoutines() {
  try{const { rows } = await client.query(`
SELECT id, "creatorId", "isPublic", name, goal, 
  FROM routines;`);
  console.log("activities", rows);

  return rows;
} catch(error){
  console.error(error)
  throw error
}
}


async function getAllPublicRoutines() {
  try{const { rows } = await client.query(`
SELECT id, "creatorId", "isPublic", name, goal
  FROM routines;`);

  return rows;
} catch(error){
  console.error(error)
  throw error
}
}

async function destroyRoutine(id) {

    try {
      await client.query(`
        DELETE FROM routines
        WHERE id = $1;
      `, [id])
    
    } catch(error) {
      console.log(error)
      throw error
    }
    }

module.exports = {createRoutine, getRoutineById, getAllRoutines, getAllPublicRoutines, destroyRoutine};