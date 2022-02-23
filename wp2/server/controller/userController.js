const User = require('../models/user')
const bcrypt = require("bcryptjs")

login = async(req, res) => {
    const {username, password} = req.body

    try {
        const user = await User.findOne({username})
        if (!user)
            return res.status(400).json({status: "ERROR"})

        const matching = await bcrypt.compare(password, user.password)
        console.log("isMatching: ", matching)
        if(!matching)
            return res.json({status: "ERROR"})

        req.session.isAuth = true;
        res.json({status: "OK"})
    } catch(err) {
       console.log("ERROR: ", err)
        res.json({status: "ERROR"})
    }
}

logout = (req, res) => {
    req.session.destroy((err) => {
        if(err)
            throw err;
        res.json({status: "OK"})
    })
}

adduser = async (req, res) => {
    const {username, password, email} = req.body

    try {
        let user = await User.findOne({email})

        if (user){
            console.log("User already exists")
            return res.json({status: 'ERROR'})
        }

        const hashedPw = await bcrypt.hash(password, 10)

        user = new User({
            username,
            password: hashedPw,
            email,
            verified: false
        })

        await user.save()
        res.json({status: 'OK'})
    } catch (err) {
        console.log("Error finding user")
        console.log('error')
        res.status(400).json({status: 'ERROR'})
    }

}

module.exports = {
    login,
    logout,
    adduser
}