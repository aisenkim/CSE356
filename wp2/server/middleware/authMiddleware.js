const isAuthenticated = (req, res, next) => {
   if(req.session.isAuth)
       next()
    else
        return res.sendStatus(400).json({status: "ERROR"})
}

module.exports = {isAuthenticated}
