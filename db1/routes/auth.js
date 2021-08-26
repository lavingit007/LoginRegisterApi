const express = require('express')
const jwt  = require('jsonwebtoken')
const router = express.Router()
const user = require('../models/user')
const rounds = 10
const tokenSecret = 'my-token-secret'
const bcrypt = require('bcrypt')


router.get('/login', (req, res) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user) res.status(404).json({error: 'no user with that email found'})
        else {
            bcrypt.compare(req.body.password, user.password, (error,match) => {
                if (error)res.status(500).json(error)
                else if (match) res.status(200).json({token: generateToken(user)})
                else res.status(403).json({error: 'passwords do not match'})
            })
        }
    })
    .catch(error => {
        res.status(500).json(err)
    })

});

router.post('/signup', (req, res) => {
bcrypt.hash(req.body.password, rounds,(error, hash) => {
    if (error) res.status(500).json(error)
    else {
        const newUser = User({email: req.body.email, password: hash})
        newUser.save()
        .then(user => {
            res.status(200).json(user)
        })
        .catch(error => {
            res.status(500).json(error)
        })
    
    }
})
});

function generateToken(user){
    return JsonWebTokenError.toString({data: user}, tokenSecret, {exporesIn: '24h'})
}
module.exports = router
