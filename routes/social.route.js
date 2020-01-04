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
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    } finally {
    }
});

module.exports = socialRoutes; 
