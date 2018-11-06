const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = function (passport) {
    //local strategy
    passport.use(new LocalStrategy((username,password,done)=>{
        //match username
        let query = {username:username};
        User.findOne(query, (err, user)=>{
            if (err) throw err;
            if (!user){
                return done(null, false,{message: 'NO user found.'});
            }

            //match password
            bcrypt.compare(password, user.password, (err, isMatch)=>{
                if (err) throw err;
                if (isMatch){
                    return done (null, user);
                }else {
                    return done(null, false,{message: 'Wrong password.'});
                }
            });
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}

