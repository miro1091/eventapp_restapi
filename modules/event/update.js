const { getEventsFromDb } = require('../functions');

const eventUpdate = (mydb, req, res) => {
    const eventId = req.params.id;
    if (eventId.length > 0) {
        getEventsFromDb(mydb, eventId).then((event) => {

            const eventUpdated = Object.assign({}, event[0], req.body)

            mydb.insert(eventUpdated, function (err, body, header) {
                if (err) {
                    res.status(400).json({
                        message: "unable to update event"
                    });
                    return;

                }
                res.status(200).json({
                    message: "event was updated successfully"
                });
                return;
            });

        })
    }
}

module.exports = eventUpdate;