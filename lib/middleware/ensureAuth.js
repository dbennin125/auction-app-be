const User = require('../models/User');

const parsedHeader = authorization => {
    const [username, password] = 
    //destructor username and password
    Buffer
    .from(authorization?.split(' ')[1], 'base64')
    //split on space grab the second item in array
    .toString()
    .split(':');
    //split again on : because that was the combined username and password then return them  
    return {
        username,
        password
    };
};

const ensureAuth = (req, res, next) => {
    const { username, password } = parsedHeader(req.headers.authorization);

    User
    .authorized(username, password)
    //if the user is authorized by having a username and password is correct
    .then(user => {
        req.user = user;
        next();
        //then make that req.user the user
    })
    .catch(next);
    //any errors send back
};

module.exports = {
    parsedHeader,
    ensureAuth
};
