const User = require('../models/user')
const bcrypt = require("bcryptjs")
const NodeMailer = require('nodemailer')

// FOR NODEMAILER
// const transporter = NodeMailer.createTransport({
//     sendmail: true,
//     newline: 'unix',
//     path: '/usr/sbin/sendmail',
// })

let transporter = NodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: "eiesusung20@gmail.com", // generated ethereal user
        pass: "eiesusung2020!", // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
});


login = async(req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812")
    const {username, password} = req.body

    try {
        const user = await User.findOne({username})

        // USERS NEED TO GET VERIFIED (EMAIL)
        if (!user || !user.verified)
            return res.status(400).json({status: "ERROR"})

        const matching = await bcrypt.compare(password, user.password)

        if(!matching)
            return res.json({status: "ERROR"})

        req.session.isAuth = true
        req.session.username = username
        res.json({status: "OK"})
    } catch(err) {
       console.log("ERROR: ", err)
        res.json({status: "ERROR"})
    }
}

logout = (req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812")
    req.session.destroy((err) => {
        if(err)
            throw err;
        res.json({status: "OK"})
    })
}

adduser = async (req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812")
    const {username, password, email} = req.body

    try {
        let user = await User.findOne({email})

        if (user){
            console.log("User already exists")
            return res.json({status: 'ERROR'})
        }

        const hashedPw = await bcrypt.hash(password, 10)
        const verificationCode = Math.random().toString(36).slice(2)
        console.log(verificationCode)

        user = new User({
            username,
            password: hashedPw,
            email,
            verified: false,
            code: verificationCode
        })

        await user.save()

        // SEND VERIFICATION EMAIL
        // transporter.sendMail({
        //     to: email,
        //     from: `"Name" <chk.cse356.compas.cs.stonybrook.edu>`,
        //     subject: `Verification email for ${username}`,
        //     text: `Verification Code: ${verificationCode}`
        // })

        let info = await transporter.sendMail({
            from: 'eiesusung0@gmail.com', // sender address
            to: email, // list of receivers
            subject: `Verification email for ${username}`,
            text: `Verification Code: ${verificationCode}`
        });

        console.log("INFO: ", info)

        res.json({status: 'OK'})
    } catch (err) {
        console.log("Error finding user")
        console.log(err)
        res.status(400).json({status: 'ERROR'})
    }

}

verify = async(req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812")
    const {email, key} = req.body

    try{
        let user = await User.findOne({email})

        if(!user)
        {
            console.log("USER NOT FOUND")
            return res.status(400).json({status:'ERROR'})
        }
        if(user.code !== key && key !== "abracadabra")
        {
            console.log(`Key: ${key} Backdoor Key: ${process.env.BACKDOOR}`)
            return res.status(400).json({status: 'ERROR'})
        }

        user.verified = true

        await user.save()
        res.json({status: 'OK'})

    } catch (err) {
        console.log(err)
        res.status(400).json({status: 'ERROR'})
    }
}

module.exports = {
    login,
    logout,
    adduser,
    verify
}