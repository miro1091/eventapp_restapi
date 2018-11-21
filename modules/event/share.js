const googleCalendar = require('../google_calendar');

const eventShare = (mydb, req, res) => {
    const { email } = req.body;
    
    if (email.length > 1) {
        googleCalendar(email);
        res.json({
            message: "success"
        });
    } else {
        res.status(400).json({
            message: "something is wrong"
        });
    }
}

module.exports = eventShare;