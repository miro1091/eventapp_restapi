const { getReviewsFromDb } = require('../functions');

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

    getReviewsFromDb(mydb).then(() => {

        let {
            id_event,
            review,
            user_name,
            rating,
            timestamp,
        } = req.body;

        if (validateCreateEventInfo(id_event, review, user_name, rating, timestamp)) {

            let doc = {
                id_event,
                review,
                user_name,
                rating,
                timestamp,
                "selector": {
                    "type": "review"
                },
                "visible": '1'
            };

            mydb.insert(doc, function (err, body, header) {
                if (err) {
                    res.status(400).json({
                        message: "unable insert review"
                    });
                    return;
                }
                res.status(200).json({
                    message: "review was inserted successfully"
                });
                return;
            });

        } else {
            res.status(400).json({
                message: "unable to insert review - invalid inputs"
            });
            return;
        }

    }).catch(err => {
        res.status(400).json('promise error');
        return;
    })
}

module.exports = eventCreate;