const client = require('./client');
const {attachActivitiesToRoutines} = require('./activities');

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
  try{const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName" 
    FROM routines
    JOIN users ON routines."creatorId"=users.id;
  `);

  return await attachActivitiesToRoutines(routines);
} catch(error){
  console.error("Could not get all routines!!")
  throw error
}
}


async function getAllPublicRoutines() {
  try{const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE "isPublic"=true;
    `);

  return await attachActivitiesToRoutines(routines);
} catch(error){
  console.error("Could not get all public routines!!");
  throw error
}
}

async function getAllRoutinesByUser(user) {
  

  try{
      const {rows: routine} = await client.query(`
      SELECT routines.*, 
      users.username as "creatorName"
      FROM routines
      JOIN users on routines."creatorId" = users.id
      WHERE users.username =$1
    `, [user.username]);

      const routine_activitiesGoal = await attachActivitiesToRoutines(routine);
      console.log(routine_activitiesGoal);

      return routine_activitiesGoal;
    
      

  }catch(error){
      console.error(error)
      throw error
  }
}

async function getPublicRoutinesByUser({username}) {

  try{
      const {rows: routines} = await client.query(`
      SELECT routines.*, users.username as "creatorName"
      FROM routines
      JOIN users on routines."creatorId" = users.id
      WHERE username=$1 AND "isPublic"=$2;
    `, [username, true]);

      return attachActivitiesToRoutines(routines);

  }catch(error){
      console.error("There was a problem getting all routines by user!");
      throw error
  }
}

async function getPublicRoutinesByActivity({id}){
    try{
        const {rows: routines} = await client.query(`
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId"=users.id
        WHERE "isPublic"=true
        `);
return await attachActivitiesToRoutines(routines);
    } catch (error){
        console.error("Unable to get public routines by activity!");
        throw error;
    }
}

async function getRoutinesWithoutActivities(){
  try{const {rows: routine} = await client.query(`
  SELECT *
  FROM ROUTINES`)

  return routine;

  
}catch(error){
  console.error(error)
  throw error
}
}

async function updateRoutine(fields = {}){

    const storeId = fields.id
    delete fields.id

    const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index +1}`)
    .join(", ");

    if (setString.length === 0){
        return;
    }

    try{
        let updateRoutine = await getRoutineById(storeId)

        const {rows: [routine]} = await client.query(`
        UPDATE routines
        SET ${setString}
        WHERE id=${updateRoutine.id}
        RETURNING *;
        `, Object.values(fields));
        return routine;
    } catch(error){
        console.error(error)
        throw error
    }
}

async function destroyRoutine(id) {

    try {const {rows: [routine]} = await client.query(`
    DELETE FROM routines
    WHERE id = $1
    RETURNING *;
  `, [id])
    
      await client.query(`
  DELETE FROM routine_activities
  WHERE "routineId" = $1
`, [id])

    return routine;
      
    } catch(error) {
      console.log(error)
      throw error
    }
    }

module.exports = {createRoutine, getRoutineById, getAllRoutines, getRoutinesWithoutActivities, getAllPublicRoutines, getAllRoutinesByUser, getPublicRoutinesByUser, getPublicRoutinesByActivity, updateRoutine, destroyRoutine};