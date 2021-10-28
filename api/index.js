const express = require('express');
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET = 'neverTell' } = process.env;

const {getUserById} = require("../db")

apiRouter.get(`/health`, async function(req, res, next){
res.send({message: `Time to get Active!`})
})

apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    
    if (!auth) { // nothing to see here
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
      
      try {
        const parsedToken = jwt.verify(token, JWT_SECRET);
        
        const id = parsedToken && parsedToken.id
        if (id) {
          req.user = await getUserById(id);
          next();
        }
      } catch (error) {
        next(error);
      }
    } else {
      next({
        name: 'AuthorizationHeaderError',
        message: `Authorization token must start with ${ prefix }`
      });
    }
  });

apiRouter.use("/users", require('./users'))
apiRouter.use("/activities", require('./activities'))
apiRouter.use("/routines", require('./routines'))
apiRouter.use("/routine_activities", require('./routine_activities'))

module.exports = apiRouter;
