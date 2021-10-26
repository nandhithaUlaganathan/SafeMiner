const jwt = require("jsonwebtoken");
const Users = require("../models/user");

const auth = async (req, res, next) => {
    try {
        var token = req.header('Authorization').replace('Bearer ', '');

        const decoded = jwt.verify(token, 'jknasdcdoaicjadcnknki');
        const user = await Users.findById(decoded._id);

        if (!user) {
            res.status(400).send("Unauthorized");
            return;
        }

        next();

    } catch (e) {
        res.status(400).send("Unauthorized");
    }
}

module.exports = auth;