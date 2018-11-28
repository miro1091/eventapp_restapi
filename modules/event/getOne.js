const { getEventsFromDb } = require('../functions');

const getOneEvent = (mydb, req, res) => {
    const eventId = req.params.id;
    if (eventId.length > 0) {
        getEventsFromDb(mydb, eventId).then((event) => {

            if(event){
                res.json(event)
            }else{
                res.status(400).json({message:'get event error occured'})
            }

        })
    }
}

module.exports = getOneEvent;