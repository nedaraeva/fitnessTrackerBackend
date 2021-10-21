const client = require('./client');
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;



async function createUser({ username, password }) {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

    try {
        const { rows: [user] } = await client.query(`
        INSERT INTO users(username, password) 
        VALUES($1, $2) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [username, hashedPassword]);
        delete user.password;
        return user;
    } catch (error) {
        throw error;
    }
}

async function getUser({ username, password }) {
    if (!username || !password) {
        return;
      }
    
    try {
        const { rows: [user] } = await client.query(`
        SELECT *
          FROM users
          WHERE username = $1
          ;`, [username]);

        // const user = await getUserByUserName(username);
        console.log("user", user);
        console.log("password", password);
        const hashedPassword = user.password;
        console.log("hashedPassword", password, hashedPassword);
        const passwordMatch = await bcrypt.compare(password, hashedPassword)
        console.log("passwordMatch", passwordMatch);
        if (!passwordMatch){
            console.log("BrokenPassword");
         return;
        }

        // bcrypt.compare(password, hashedPassword, function (err, passwordsMatch) {
        //     if (passwordsMatch) {
        //         // return the user object (without the password)
                
        //     } else {
        //         throw { message: "Password Not Match" };
        //     }
        // });
        delete user.password;

        return user;
    } catch (error) {
        throw error
    }
}


module.exports = { createUser, getUser };