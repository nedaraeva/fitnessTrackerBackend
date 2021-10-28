const express = require('express');
const apiRouter = express.Router();

// attach other routers from files in this api directory (users, activities...)

apiRouter.get(`/health`, async function(req, res, next){
res.send({message: `Time to get Active!`})
})


apiRouter.use("/users", require('./users'))
apiRouter.use("/activities", require('./activities'))
apiRouter.use("/routines", require('./routines'))
apiRouter.use("/routine_activities", require('./routine_activities'))


module.exports = apiRouter;
