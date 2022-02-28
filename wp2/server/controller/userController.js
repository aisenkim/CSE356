const User = require('../models/user')
const bcrypt = require("bcryptjs")
const NodeMailer = require('nodemailer')
// const postmark = require('postmark')

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

// const client = new postmark.ServerClient("be3d5246-a0a8-4107-ab3f-51cf05a9eee2");

login = async(req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812")
    const {username, password} = req.body

    console.log("LOGIN CALLED")

    try {
        const user = await User.findOne({username})

        // USERS NEED TO GET VERIFIED (EMAIL)
        if (!user || !user.verified)
        {
            console.log("USER NOT VERFIED: ", user)
            return res.json({status: "ERROR"})
        }

        const matching = await bcrypt.compare(password, user.password)

        if(!matching)
        {
            console.log("PASSWORD doesn't match")
            return res.json({status: "ERROR"})
        }

        req.session.isAuth = true
        req.session.username = username
        res.json({status: "OK"})
    } catch(err) {
       console.log("ERROR: ", err)
        res.json({status: "ERROR"})
    }
}

logout = (req, res) => {
    console.log("LOGOUT CALLED")
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812")
    req.session.destroy((err) => {
        if(err)
            throw err;
        res.json({status: "OK"})
    })
}

adduser = async (req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812")
    console.log("ADDING USER")
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
            code: verificationCode,
            board: [' ' , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            boardId: Math.random().toString(36).slice(2)
        })

        await user.save()

        // SEND VERIFICATION EMAIL WITH GMAIL
        let info = await transporter.sendMail({
            from: 'chk@chk.cse356.compas.cs.stonybrook.edu', // sender address
            to: email, // list of receivers
            subject: `Verification email for ${username}`,
            text: `Verification Code: ${verificationCode}`
        });

        //POSTMARK SENDING EMAIL VERIFICATION
        // client.sendEmail({
        //     "From": "chk@chk.cse356.compas.cs.stonybrook.edu",
        //     "To": email,
        //     "Subject": "Verification Email",
        //     "TextBody": verificationCode
        // });

        console.log("INFO: ", info)

        res.json({status: 'OK'})
    } catch (err) {
        console.log("Error finding user")
        console.log(err)
        res.json({status: 'ERROR'})
    }

}

verify = async(req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812")
    const {email, key} = req.body

    console.log("VERIFY CALLED")

    try{
        let user = await User.findOne({email})

        if(!user)
        {
            console.log("USER NOT FOUND")
            return res.json({status:'ERROR'})
        }
        if(user.code !== key && key !== "abracadabra")
        {
            console.log(`Key: ${key} Backdoor Key: ${process.env.BACKDOOR}`)
            return res.json({status: 'ERROR'})
        }

        user.verified = true
        console.log("VERIFIED SET TO TRUE")

        await user.save()
        res.json({status: 'OK'})

    } catch (err) {
        console.log(err)
        res.json({status: 'ERROR'})
    }
}

module.exports = {
    login,
    logout,
    adduser,
    verify
}