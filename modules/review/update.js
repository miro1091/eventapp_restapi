const { getReviewsFromDb } = require('../functions');

const reviewUpdate = (mydb, req, res) => {
    const reviewId = req.params.id;
    if (reviewId.length > 0) {
        getReviewsFromDb(mydb, reviewId, 'update').then((review) => {

            const reviewUpdated = Object.assign({}, review[0], req.body)

            mydb.insert(reviewUpdated, function (err, body, header) {
                if (err) {
                    res.status(400).json({
                        message: "unable to update review"
                    });
                    return;

                }
                res.status(200).json({
                    message: "review was updated successfully"
                });
                return;
            });

        })
    }
}

module.exports = reviewUpdate;