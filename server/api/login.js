const express = require('express');
const {user_model} = require('../dbConnection/db');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Middleware to handle already logged in re-direct



// Register

router.post('/register', async (req, res) => {
    const {name, password} = req.body;
    // console.log(req.body);
    // res.send(req.body);
    if (name && password) {
        try {
            const exists = await user_model.findOne({name: name}); // if not found, exists = null
            // console.log(exists);
            if (exists) {
                res.send('User already exists!');
            } else {
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(password, salt);
                const user = new user_model({
                    name,
                    password: hash
                });
                try {
                    await user.save();
                    req.session.userID = user._id;
                    res.status(200).send(user._id);
                } catch (error) {
                    res.send(error);
                }
            }
        } catch (error) {
            res.send(error);
        }
        
    } else {
        res.send('Please enter name and password!');
    }
});

// Login

router.post('/login', async (req, res) => {
    const {name, password} = req.body;
    // console.log(name);
    if (name && password) {
        try {
            const _user = await user_model.findOne({name: name});
            // console.log(_user);
            if (_user) {
                const matched = await bcrypt.compare(password, _user.password);
                // console.log(matched);
                if (matched) {
                    // console.log('trying to set session...');
                    req.session.userID = _user._id;
                    res.send(_user._id);
                } else {
                    res.send(null);
                }
            }
        } catch (error) {
            res.send(null);
        }
    } else {
        res.send(null);
    }
});

// helper api for checking session availability

router.get('/checkuser', (req, res) => {
    
    // res.send(req.session.userID);
    
    
    
    if (req.session.userID) {
        res.send(req.session.userID);
    } else {
        res.send(null);
    }
});

router.post('/logout', async (req, res) => {
    if (req.session.userID) {
        await req.session.destroy();
        res.clearCookie('sid');
        res.send('session & cookie cleared!')
    } else {
        res.send(null);
    }
})

module.exports = router;