const { getUsersfromDb } = require('../functions');
const bcrypt = require('bcrypt-nodejs');

const userLogin = (mydb, req, res) => {
    let {
        email,
        password
    } = req.body;

    const validateUserLoginInfo = (password, email, usersInDb) => {

        if (password.length < 1 || email.length < 1) {
            return 0;
        }

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(email).toLowerCase())) {
            return 0;
        }

        for (let i = 0; i < usersInDb.length; i++) {
            if (usersInDb[i].email === email) {

                if (bcrypt.compareSync(password, usersInDb[i].password)) {
                    return usersInDb[i]._id;
                }
            }
        }

        return 0;
    }

    getUsersfromDb(mydb).then((registeredUsers) => {
        const loginValue = validateUserLoginInfo(password, email, registeredUsers);
        if (loginValue !== 0) {
            const loginInfo = {
                userId: loginValue
            }
            res.json(loginInfo);
        } else {
            res.status(400).json({
                message: "uunable to login user - invalid inputs"
            });
            return;
        }

    }).catch(err => {
        res.status(400).json({
            message: "promise error"
        });
        return;
    })
}

module.exports = userLogin;