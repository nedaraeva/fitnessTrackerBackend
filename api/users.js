const express = require('express');
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET = 'neverTell' } = process.env;

const {createUser, getUser, getUserByUserName, getPublicRoutinesByUser} = require("../db")

usersRouter.post("/register", async (req, res, next) => {
    try {
      const { username, password } = req.body;
  
      if (password.length < 8) {
        res.status(401).send({
          name: "passwordLengthError",
          message: "Your password must be at least 8 characters long.",
        });
      } else {
        const user = await createUser({ username, password });
        res.send({ user, message: "You're signed up." });
      }
    } catch (error) {
      next(error);
    }
  });

  usersRouter.post("/login", async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        next({
            name: "MissingCredentials",
            message: "Username or password is missing."
        });
    }

    try {
        const user = await getUser({username, password});
        if (user) {
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {expiresIn: "1w"})
            res.send({ message: "Logged in.", token, user });
        } else {
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect.'
            });
    }
}
     catch (error) {
        console.log(error);
        next(error)
    }
});

usersRouter.get('/me', async (req, res, next)=>{
    try{     
        if (!req.user){
            res.status(401)
            next({name: "MissingUser",
            message: "You must be logged in."})
        } else {
            res.send(req.user)
        }
    }catch(error){
        console.error(error);
        next(error);
    }
    });

    usersRouter.get('/:username/routines', async (req, res, next)=> {
        const { username } = req.params;
      
        try {
          const user = await getUserByUserName(username);
      
          if (!user){
            return res.send({message: "error finding username"})
          }
      
          const routines = await getPublicRoutinesByUser({id: user.id, username});
          res.send(routines)
      
        } catch (error) {
          next(error)
        }
      });      

  
module.exports = usersRouter;