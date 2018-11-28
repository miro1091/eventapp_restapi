const googleCalendarHandler = (email) => {
    const {
        google
    } = require('googleapis');
    const calendar = google.calendar("v3");
    var OAuth2 = google.auth.OAuth2

    //oauth2 goes here
    const oauth2Client = new OAuth2(
        "52937241797-ll34ifi5kofc0bus9d0pm9d0bcqe6jk1.apps.googleusercontent.com",
        "t3fH5OYiRo27GeqUFbdQ55nd",
        "urn:ietf:wg:oauth:2.0:oob"
    );

    oauth2Client.setCredentials({
        access_token: "ya29.GltaBoot1rkKduZLCw0ngXgfVCQfB1ACyTWizu9SIBrvNBxZWX1tvyDfbueI-zj_vmaouLIq12I0Dg0f4VOhR8wHjd0n_JrGL73L8yMydyuY5SEGOwQPejN3DP0X",
        refresh_token: "1/EKDsvwvhZpsqrxemYJs5EFcxpI461OOFAUH-X_SuRw4",
        expiry_date: true
    });

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