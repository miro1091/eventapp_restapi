const { getUsersfromDb } = require('../functions');
const bcrypt = require('bcrypt-nodejs');

const userRegister = (mydb, req, res) => {
    const validateUserRegisterInfo = (name, password, email, usersInDb) => {

        if (name.length < 1 || password.length < 1 || email.length < 1) {
            return 0;
        }

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(email).toLowerCase())) {
            return 0;
        }

        for (let i = 0; i < usersInDb.length; i++) {
            if (usersInDb[i].email === email) {
                return 0;
            }
        }

        return 1;
    }

    if (!mydb) {
        res.status(400).json("unable to connect to db");
        return;
    }

    getUsersfromDb(mydb).then((registeredUsers) => {

        let {
            name,
            email,
            password
        } = req.body;

        if (validateUserRegisterInfo(name, password, email, registeredUsers)) {
            
            let doc = {
                name,
                "password": bcrypt.hashSync(password),
                email,
                "selector": {
                    "type": "user"
                }
            };

            mydb.insert(doc, function (err, body, header) {
                if (err) {
                    res.status(400).json({
                        message: "unable to register user"
                    });
                    return;
                }
                res.status(200).json({
                    message: "user registered successfully"
                });
                return;
            });
        } else {
            res.status(400).json({
                message: "unable to register user - invalid inputs"
            });
            return;
        }

    }).catch(err => {
        res.status(400).json('promise error');
        return;
    })
}

module.exports = userRegister;