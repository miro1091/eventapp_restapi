const { getReviewsFromDb } = require('../functions');

const eventDelete = (mydb, req, res) => {
    const eventId = req.params.id;
    if (eventId.length > 0) {
        getReviewsFromDb(mydb, eventId).then((comments) => {

            if(comments){
                res.json(comments)
            }else{
                res.status(400).json({message:'get commets error occured'})
            }

        })
    }
}

module.exports = eventDelete;