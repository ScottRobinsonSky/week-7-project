const jwt = require("jsonwebtoken");
const _ = require('lodash');

function verifyJWTToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err || !decodedToken) {
                return reject(err);
            }
            resolve(decodedToken);
        });
    });
}

function createJWTToken(details) {
    if ((typeof details !== 'object') || details.hasOwnProperty("length")) {
        details = {};
    }

    if (!details.maxAge || typeof details.maxAge !== 'number') {
        details.maxAge = 3600 // 60 minutes
    }

    details.sessionData = _.reduce(details.sessionData || {}, (memo, val, key) => {
        if (typeof val !== "function" && key !== "password") {
            memo[key] = val;
        }
        return memo;
    }, {});

    let token = jwt.sign({data: details.sessionData}, process.env.JWT_SECRET, {expiresIn: details.maxAge, algorithm: "HS256"});
    return token;
}

module.exports = {createJWTToken, verifyJWTToken};