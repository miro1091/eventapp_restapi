const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

//zoznam udalosti
const events = [
    {
        "name": "Divadelné predstavenie",
        "date": "18 november",
        "location": "Košice",
        "image": "http://www.trebisov.sk/photogallery/2014/2014-02-28_divadlo_laaaska/004.jpg",
        },
        {
        "name": "Divadelné predstavenie 2",
        "date": "21 december",
        "location": "Prešov",
        "image": "http://www.trebisov.sk/photogallery/2014/2014-02-28_divadlo_laaaska/005.jpg",
        },
        {
        "name": "Divadelné predstavenie 3",
        "date": "14 januar",
        "location": "Rožňava",
        "image": "https://spisskabela.sk/wp-content/uploads/2017/12/20171217_172352_resized.jpg",
        },
        {
        "name": "Divadelné predstavenie 4",
        "date": "3 február",
        "location": "Humenné",
        "image": "http://www.trebisov.sk/photogallery/2014/2014-02-28_divadlo_laaaska/004.jpg",
        },
        {
        "name": "Divadelné predstavenie 5",
        "date": "9 september",
        "location": "Trebišov",
        "image": "http://www.trebisov.sk/photogallery/2014/2014-02-28_divadlo_laaaska/005.jpg",
        }
];

//zoznam registrovanych pouzivatelov
const users = [
    {
        id: 1,
        name: "Richard",
        surname: "Rusnak",
        email: "richard.rusnak@gmail.com",
    },
    {
        id:2,
        name: "Igor",
        surname: "Savnko",
        email: "igorsavko@gmail.com",
    }
    ,
    {
        id: 3,
        name: "Martin",
        surname: "Tovarnak",
        email: "martintovarnak@gmail.com",
    }
]

app.use(cors());
app.use(bodyParser.json());

//home page
app.get('/', (req, res) => {
    //get all events
    res.json(events);
});

app.get('/users', (req, res) => {
    //get all events
    res.json(users);
});

//specific event
app.get('/event/:id', (req, res) => {
    
    res.send('detail event page');
});

//specific event - edit
app.put('/event/edit/:id', (req, res) => {
    
    res.send('event edit');
});

//specific event - delete
app.delete('/event/delete/:id', (req, res) => {
    
    res.send('event delete');
});

//register
app.post('/register', (req, res) => {
    //bcrypt-nodejs
    res.send('register');
});

//login
app.post('/login', (req, res) => {
    //bcrypt-nodejs
    res.send('login');
});

//kontakt
app.post('/kontakt', (req, res) => {
    
    res.send('kontakt');
});


//specific event - chat
app.get('/event/chat', (req, res) => {
    
    res.send('event chat');
});

//specific event - komentare
app.get('/event/comments', (req, res) => {
    
    res.send('event comments');
});

//specific event - zdielanie
app.get('/event/share', (req, res) => {
    
    res.send('share event');
});

//user profile
app.get('/profile', (req, res) => {
    
    res.send('user profile');
});

//user profile - edit
app.put('/profile/edit', (req, res) => {
    
    res.send('user profile');
});

//user profile - delete
app.delete('/profile/delete', (req, res) => {
    
    res.send('user profile');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('app is running on port 3000');
});




//Architektura DB

// [category] //kategorie eventov
// -id (autoincrement)
// -name
// -link
// -visible

//[event_category]
// -category_id
// -event_id

// [event]
// -id (autoincrement)
// -name
// -date
// -place
// -interested //pocet zaujemcov
// -category_id
// -description
// -visible
// -created_at

// [event_user]
// -event_id
// -user_id

// [user]
// -id (autoincrement)
// -name
// -surname
// -login
// -mail
// -password
// -registered (time of creation)
// -visible
// -event_counter //pocet zucastnenych eventov
// -priatel_id
// -event_id

// [chat]
// -event_id
// -user_id
// -visible
// -created_at


// [comments]
// -event_id
// -user_id
// -visible
// -quantity
// -created_at

// [shares]
// -event_id
// -visible
// -created_at
// -user_id


// Review
// -ReviewID (int)
// -EventID (int)
// -UserID (int)
// -Comment (varchar)
// -Date_Time_Comment (date)
// -isDeleted (bool)
