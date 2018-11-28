const { getReviewsFromDb } = require('../functions');

const reviewDelete = (mydb, req, res) => {
    const reviewId = req.params.id;
    if (reviewId.length > 0) {
        getReviewsFromDb(mydb, reviewId, 'delete').then((review) => {

            const reviewUpdated = Object.assign({}, review[0], {
                "visible": "0"
            })

            mydb.insert(reviewUpdated, function (err, body, header) {
                if (err) {
                    res.status(400).json({
                        message: "unable to delete review"
                    });
                    return;

                }
                res.status(200).json({
                    message: "review was deleted successfully"
                });
                return;
            });

        })
    }
}

module.exports = reviewDelete;