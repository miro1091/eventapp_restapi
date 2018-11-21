const googleCalendarHandler = (email) => {
    const {
        google
    } = require('googleapis');
    const calendar = google.calendar("v3");
    var OAuth2 = google.auth.OAuth2

    //oauth2 goes here

    var event = {
        'summary': "summary",
        'location': "location",
        'description': "description",
        'start': {
            'dateTime': "2018-12-21T18:03:00+01:00",
            'timeZone': 'Europe/Prague',
        },
        'end': {
            'dateTime': `2018-12-21T19:03:00+01:00`,
            'timeZone': 'Europe/Prague',
        },
        'attendees': [{
            'email': email
        }, ],
    };


    calendar.events.insert({
        auth: oauth2Client,
        calendarId: 'primary',
        sendNotifications: true,
        resource: event
    }, function (err, resp) {
        if (err) {
            console.log('There was an error :', err);
            return;
        }
        console.log('Event created succesfully');
    });
}

module.exports = googleCalendarHandler