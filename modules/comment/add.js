const { getCommentsFromDb } = require('../functions');

const eventCreate = (mydb, req, res) => {
    const validateCreateEventInfo = (a, b, c, d, e) => {

        if (
            a.length < 1 ||
            b.length < 1 ||
            c.length < 1 ||
            e.length < 1
        ) {
            return 0;
        }

        return 1;
    }

    if (!mydb) {
        res.status(400).json("unable to connect to db");
        return;
    }

    getCommentsFromDb(mydb).then(() => {

        let {
            id_event,
            comment,
            user_name,
            id_parent_comment,
            timestamp,
        } = req.body;

        if (validateCreateEventInfo(id_event, comment, user_name, id_parent_comment, timestamp)) {

            let doc = {
                id_event,
                comment,
                user_name,
                id_parent_comment,
                timestamp,
                "selector": {
                    "type": "comment"
                },
                "visible": '1'
            };

            mydb.insert(doc, function (err, body, header) {
                if (err) {
                    res.status(400).json({
                        message: "unable insert comment"
                    });
                    return;
                }
                res.status(200).json({
                    message: "comment was inserted successfully"
                });
                return;
            });

        } else {
            res.status(400).json({
                message: "unable to insert comment - invalid inputs"
            });
            return;
        }

    }).catch(err => {
        res.status(400).json('promise error');
        return;
    })
}

module.exports = eventCreate;