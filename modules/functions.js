const getUsersEventsfromDb = (mydb, searchedString) => {
  let findedUsersEvents = [];
  let searchInName = "";

  return new Promise((resolve, reject) => {
    mydb.list(
      {
        include_docs: true
      },
      function(err, body) {
        if (!err) {
          body.rows.map(row => {
            if (
              row.doc.selector !== undefined &&
              row.doc.name !== undefined &&
              row.doc.selector.type &&
              (row.doc.selector.type === "user" ||
                row.doc.selector.type === "event")
            ) {
              searchInName = row.doc.name.toLowerCase();
              if (searchInName.includes(searchedString.toLowerCase())) {
                findedUsersEvents.push(row.doc);
              }
            }
          });
          resolve(findedUsersEvents);
        }
        reject();
      }
    );
  });
};

const getUsersfromDb = (mydb, userId = null) => {
  let registeredUsers = [];

  return new Promise((resolve, reject) => {
    mydb.list(
      {
        include_docs: true
      },
      function(err, body) {
        if (!err) {
          body.rows.map(row => {
            if (
              row.doc.selector !== undefined &&
              row.doc.selector.type &&
              row.doc.selector.type === "user"
            ) {
              if (
                userId !== null &&
                userId !== undefined &&
                userId.length > 1
              ) {
                if (row.doc._id === userId) {
                  registeredUsers.push(row.doc);
                  resolve(registeredUsers);
                }
              } else {
                registeredUsers.push(row.doc);
              }
            }
          });
          resolve(registeredUsers);
        }
        reject();
      }
    );
  });
};

const getEventsFromDb = (mydb, eventId = null) => {
  let events = [];

  return new Promise((resolve, reject) => {
    mydb.list(
      {
        include_docs: true
      },
      function(err, body) {
        if (!err) {
          body.rows.map(row => {
            if (
              row.doc.selector !== undefined &&
              row.doc.selector.type &&
              row.doc.selector.type === "event" &&
              row.doc.visible == "1"
            ) {
              if (
                eventId !== null &&
                eventId !== undefined &&
                eventId.length > 1
              ) {
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
      }
    );
  });
};

const getCommentsFromDb = (mydb, commentId = null, process = null) => {
  let comments = [];

  return new Promise((resolve, reject) => {
    mydb.list(
      {
        include_docs: true
      },
      function(err, body) {
        if (!err) {
          body.rows.map(row => {
            if (
              row.doc.selector !== undefined &&
              row.doc.selector.type &&
              row.doc.selector.type === "comment" &&
              row.doc.visible == "1"
            ) {
              if (
                commentId !== null &&
                commentId !== undefined &&
                commentId.length > 1
              ) {
                if (
                  process != null &&
                  (process === "delete" || process === "update")
                ) {
                  if (row.doc._id === commentId) {
                    comments.push(row.doc);
                    resolve(comments);
                  }
                } else {
                  if (row.doc.id_event === commentId) {
                    comments.push(row.doc);
                  }
                }
              } else {
                comments.push(row.doc);
              }
            }
          });
          resolve(comments);
        }
        reject();
      }
    );
  });
};

const getReviewsFromDb = (mydb, reviewId = null, process = null) => {
  let reviews = [];

  return new Promise((resolve, reject) => {
    mydb.list(
      {
        include_docs: true
      },
      function(err, body) {
        if (!err) {
          body.rows.map(row => {
            if (
              row.doc.selector !== undefined &&
              row.doc.selector.type &&
              row.doc.selector.type === "review" &&
              row.doc.visible == "1"
            ) {
              if (
                reviewId !== null &&
                reviewId !== undefined &&
                reviewId.length > 1
              ) {
                if (
                  process != null &&
                  (process === "delete" || process === "update")
                ) {
                  if (row.doc._id === reviewId) {
                    reviews.push(row.doc);
                    resolve(reviews);
                  }
                } else {
                  if (row.doc.id_event === reviewId) {
                    reviews.push(row.doc);
                  }
                }
              } else {
                reviews.push(row.doc);
              }
            }
          });
          resolve(reviews);
        }
        reject();
      }
    );
  });
};

module.exports = {
  getUsersfromDb,
  getEventsFromDb,
  getCommentsFromDb,
  getReviewsFromDb,
  getUsersEventsfromDb
};
