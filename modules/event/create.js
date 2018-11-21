const { getEventsFromDb } = require('../functions');

const eventCreate = (mydb, req, res) => {
    const validateCreateEventInfo = (name, description, date, location, category, image) => {

        if (
            name.length < 1 ||
            description.length < 1 ||
            date.length < 1 ||
            location.length < 1 ||
            category.length < 1 ||
            image.length < 1
        ) {
            return 0;
        }

        return 1;
    }

    if (!mydb) {
        res.status(400).json("unable to connect to db");
        return;
    }

    getEventsFromDb(mydb).then(() => {

        let {
            name,
            description,
            date,
            location,
            category,
            image
        } = req.body;

        if (validateCreateEventInfo(name, description, date, location, category, image)) {

            let doc = {
                name,
                description,
                date,
                location,
                image,
                category,
                "selector": {
                    "type": "event"
                },
                "visible": '1'
            };

            mydb.insert(doc, function (err, body, header) {
                if (err) {
                    res.status(400).json({
                        message: "unable insert event"
                    });
                    return;
                }
                res.status(200).json({
                    message: "event was inserted successfully"
                });
                return;
            });

        } else {
            res.status(400).json({
                message: "unable to insert event - invalid inputs"
            });
            return;
        }

    }).catch(err => {
        res.status(400).json('promise error');
        return;
    })
}

module.exports = eventCreate;