const isAuthenticated = (req, res, next) => {
   if(req.session.isAuth)
   {
       console.log("Is Authenticated for user: ", req.session.username)
       next()
   }
    else
   {
       console.log("Problem with authentication")
       return res.json({status: "ERROR"})
   }
}

module.exports = {isAuthenticated}
