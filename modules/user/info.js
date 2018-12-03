const { getUsersfromDb } = require("../functions");

const userInfo = (mydb, req, res) => {
  const userId = req.params.id;

  getUsersfromDb(mydb, userId)
    .then(registeredUsers => {
      if (registeredUsers !== 0) {
        res.json(registeredUsers);
      } else {
        res.status(400).json({
          message: "uunable to get user info"
        });
        return;
      }
    })
    .catch(err => {
      res.status(400).json({
        message: "promise error"
      });
      return;
    });
};

module.exports = userInfo;
