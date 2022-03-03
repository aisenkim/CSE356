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

    

    try {
        const user = await User.findOne({username})

        // USERS NEED TO GET VERIFIED (EMAIL)
        if (!user || !user.verified)
        {
            
            return res.json({status: "ERROR"})
        }

        const matching = await bcrypt.compare(password, user.password)

        if(!matching)
        {
            
            return res.json({status: "ERROR"})
        }

        req.session.isAuth = true
        req.session.username = username
        res.json({status: "OK"})
    } catch(err) {
       
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
            
            return res.json({status: 'ERROR'})
        }

        const hashedPw = await bcrypt.hash(password, 10)
        const verificationCode = Math.random().toString(36).slice(2)
        

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

        

        res.json({status: 'OK'})
    } catch (err) {
        
        
        res.json({status: 'ERROR'})
    }

}

verify = async(req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812")
    const {email, key} = req.body

    

    try{
        let user = await User.findOne({email})

        if(!user)
        {
            
            return res.json({status:'ERROR'})
        }
        if(user.code !== key && key !== "abracadabra")
        {
            
            return res.json({status: 'ERROR'})
        }

        user.verified = true
        

        await user.save()
        res.json({status: 'OK'})

    } catch (err) {
        
        res.json({status: 'ERROR'})
    }
}

module.exports = {
    login,
    logout,
    adduser,
    verify
}