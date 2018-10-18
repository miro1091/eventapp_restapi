const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const cfenv = require("cfenv");

let cloudant, mydb;

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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//home page
app.get('/', (req, res) => {
    //get all events

    let names = [];
    if(!mydb) {
        console.log('not connected to db');
        res.json(names);
        return;
    }

    mydb.list({ include_docs: true }, function(err, body) {
        if (!err) {
        body.rows.forEach(function(row) {
            if(row.doc.name){
                names.push({
                    id:row.doc._id,
                    name:row.doc.name,
                    date:row.doc.date,
                    location:row.doc.location,
                    img:row.doc.image
                });
            }
        });
        res.json(names);
        }
    });

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
 
app.post('/testdb', (req, res) => {

    let userName = req.body.name;
    let doc = { "name" : userName };
    if(!mydb) {
        console.log("No database.");
    }

    res.json(req.body.name);
});


// load local VCAP configuration  and service credentials
let vcapLocal;

try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) { }

const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);

// Load the Cloudant library.
let Cloudant = require('@cloudant/cloudant');
if (appEnv.services['cloudantNoSQLDB'] || appEnv.getService(/cloudant/)) {

  // Initialize database with credentials
  if (appEnv.services['cloudantNoSQLDB']) {
    // CF service named 'cloudantNoSQLDB'
    cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
  } else {
     // user-provided service with 'cloudant' in its name
     cloudant = Cloudant(appEnv.getService(/cloudant/).credentials);
  }
} else if (process.env.CLOUDANT_URL){
  cloudant = Cloudant(process.env.CLOUDANT_URL);
}
if(cloudant) {
  //database name
  let dbName = 'mydb';

  // Create a new "mydb" database.
  cloudant.db.create(dbName, function(err, data) {
    if(!err) //err if database doesn't already exists
      console.log("Created database: " + dbName);
  });

  // Specify the database we are going to use (mydb)...
  mydb = cloudant.db.use(dbName);
}

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
