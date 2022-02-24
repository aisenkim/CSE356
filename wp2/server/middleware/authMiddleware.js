const isAuthenticated = (req, res, next) => {
    console.log(req.session)
   if(req.session.isAuth)
   {
       next()
   }
    else
   {
       return res.json({status: "ERROR"})
   }
}

module.exports = {isAuthenticated}
