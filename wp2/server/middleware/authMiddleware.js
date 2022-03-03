const isAuthenticated = (req, res, next) => {
   if(req.session.isAuth)
   {
       
       next()
   }
    else
   {
       
       // IF ERROR USE url path and next() to tttController and let controller check if user is authenticated or not
       return res.json({status: "ERROR"})
   }
}

module.exports = {isAuthenticated}
