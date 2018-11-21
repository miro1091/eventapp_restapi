const { getEventsFromDb } = require('../functions');

const eventDelete = (mydb, req, res) => {
    const eventId = req.params.id;
    if (eventId.length > 0) {
        getEventsFromDb(mydb, eventId).then((event) => {

            const eventUpdated = Object.assign({}, event[0], {
                "visible": "0"
            })


            mydb.insert(eventUpdated, function (err, body, header) {
                if (err) {
                    res.status(400).json({
                        message: "unable to delete event"
                    });
                    return;

                }
                res.status(200).json({
                    message: "event was deleted successfully"
                });
                return;
            });

        })
    }
}

module.exports = eventDelete;