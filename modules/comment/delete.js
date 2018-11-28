const { getCommentsFromDb } = require('../functions');

const commentDelete = (mydb, req, res) => {
    const commentId = req.params.id;
    if (commentId.length > 0) {
        getCommentsFromDb(mydb, commentId, 'delete').then((comment) => {

            const commentUpdated = Object.assign({}, comment[0], {
                "visible": "0"
            })


            mydb.insert(commentUpdated, function (err, body, header) {
                if (err) {
                    res.status(400).json({
                        message: "unable to delete comment"
                    });
                    return;

                }
                res.status(200).json({
                    message: "comment was deleted successfully"
                });
                return;
            });

        })
    }
}

module.exports = commentDelete;