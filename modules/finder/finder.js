const { getUsersEventsfromDb } = require("../functions");

const finder = (mydb, req, res) => {
  const searchedString = req.params.searchedString;
  if (!mydb) {
    res.status(400).json({
      message: "cant connect to db"
    });
    return;
  }

  getUsersEventsfromDb(mydb, searchedString)
    .then(events => {
      res.status(200).json(events);
      return;
    })
    .catch(err => {
      res.status(400).json("promise error");
      return;
    });
};

module.exports = finder;
