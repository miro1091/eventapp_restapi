const getUsersfromDb = (mydb) => {
    let registeredUsers = [];

    return new Promise((resolve, reject) => {
        mydb.list({
            include_docs: true
        }, function (err, body) {
            if (!err) {
                body.rows.map(row => {
                    if (row.doc.selector !== undefined && row.doc.selector.type && row.doc.selector.type === 'user') {
                        registeredUsers.push(row.doc);
                    }
                });
                resolve(registeredUsers);
            }
            reject();

        });
    })
}

const getEventsFromDb = (mydb, eventId = null) => {
    let events = [];

    return new Promise((resolve, reject) => {
        mydb.list({
            include_docs: true
        }, function (err, body) {
            if (!err) {
                body.rows.map(row => {
                    if (
                        row.doc.selector !== undefined &&
                        row.doc.selector.type &&
                        row.doc.selector.type === 'event' &&
                        row.doc.visible == '1'
                    ) {
                        if (eventId !== null && eventId !== undefined && eventId.length > 1) {
                            if (row.doc._id === eventId) {
                                events.push(row.doc);
                                resolve(events);
                            }
                        } else {
                            events.push(row.doc);
                        }

                    }
                });
                resolve(events);
            }
            reject();

        });
    })
}

module.exports = {
    getUsersfromDb,
    getEventsFromDb
}