const { getCommentsFromDb } = require('../functions');

const commentUpdate = (mydb, req, res) => {
    const commentId = req.params.id;
    if (commentId.length > 0) {
        getCommentsFromDb(mydb, commentId, 'update').then((comment) => {

            const commentUpdated = Object.assign({}, comment[0], req.body)

            mydb.insert(commentUpdated, function (err, body, header) {
                if (err) {
                    res.status(400).json({
                        message: "unable to update comment"
                    });
                    return;

                }
                res.status(200).json({
                    message: "comment was updated successfully"
                });
                return;
            });

        })
    }
}

module.exports = commentUpdate;