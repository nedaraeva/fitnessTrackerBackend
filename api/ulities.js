function requireuser (req, res, next){
    if (!req.user){
res.status(401)
next({name:"Login Error" , message: "You logged in to this route" })

    }

next()
    
}

module.exports = {requireuser}