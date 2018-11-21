const { getEventsFromDb } = require('../functions');

const eventShowAll = (mydb, req, res) => {
    if (!mydb) {
        res.status(400).json({
            message: "cant connect to db"
        });
        return;
    }

    getEventsFromDb(mydb).then((events) => {
        res.status(200).json(events);
        return;
    }).catch(err => {
        res.status(400).json('promise error');
        return;
    })
}

module.exports = eventShowAll;