const express = require('express');
const socialRoutes = express.Router();
const authConfig = require('../social/auth-config');
let authorization = require('../models/authorization');
const Authentication = require('../social');

const auth = new Authentication({ routes: authConfig });

socialRoutes.route('/token').post(function (req, res) {
    try {
        const login = req.body.socialAuthorization;
        auth.authenticate(login).then(credentials => {
            let authObj = new authorization({ email: credentials.user.email, refreshToken: credentials.refreshToken });
            let user =  { email: credentials.user.email, id: credentials.user.id, name: credentials.user.name, pic: credentials.user.pic }
            if (authorization.findOne({ email: credentials.user.email }) == null) {
                authorization.create(authObj, function (err, auth) {
                    if (err)
                        return res.status(500).send(err);
                    else
                        return res.status(200).send({ auth: true, user: user,  token: credentials.token, refreshToken: credentials.refreshToken });
                });
            }
            else {
                authorization.findOneAndUpdate({ email: credentials.user.email }, { refreshToken: credentials.refreshToken }, function (err, doc, next) {
                    if (err)
                        return res.status(500).send(err);
                    else
                        return res.status(200).send({ auth: true, user: user, token: credentials.token, refreshToken: credentials.refreshToken });
                });
            }
            //dopo l'app fara l'add dello user sul DB Resource. per fare l'add l'applicazione passarà l'access token e il resource server validerà il token mediante l'auth server
            // User.findOne({ 'google.id': credentials.id }, function (err, user) {
            //     if (err) return res.status(500).send("There was a problem finding the user.");
            //     if (user) return res.status(404).send("User found. ");
            //     let tempUser = new User({ method: login.type, google: { email: credentials.email, id: credentials.id, name: credentials.name, pic: credentials.pic } });
            //     User.save(tempUser, function (err, user) {
            //         if (err) {
            //             return res.status(500).json({ 'err': err });
            //         }
            //         else {
            //             return res.status(200).send({ auth: true, user: user, token: credentials.token, refreshToken: credentials.refreshToken });
            //         }
            //     });
            // });
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    } finally {
    }
});

module.exports = socialRoutes; 
