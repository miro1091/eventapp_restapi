const express = require("express");
const bodyParser = require('body-parser');
const bcrypt =  require('bcrypt-nodejs');
const app = express();
const cors = require('cors');
const cfenv = require("cfenv");
const UUID = require("uuid");

let cloudant, mydb;

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

let registeredUsers = [];
let events = [];

    const getUsersfromDb = () => {

        return new Promise((resolve, reject)=>{
            mydb.list({ include_docs: true }, function(err, body) {
                if (!err) {
                    body.rows.map(row => {
                        if(row.doc.selector.type && row.doc.selector.type === 'user'){
                            registeredUsers.push(row.doc);
                            }
                        });
                    resolve();
                }
                    reject();
                
            });
        })
    }

    const getEventsFromDb = () => {

        return new Promise((resolve, reject)=>{
            mydb.list({ include_docs: true }, function(err, body) {
                if (!err) {
                    body.rows.map(row => {
                        if(row.doc.selector.type && row.doc.selector.type === 'event'){
                            events.push(row.doc);
                            }
                        });
                    resolve();
                }
                    reject();
                
            });
        })
    }

//home page
app.get('/', (req, res) => {
    //get all events
    
    if(!mydb) {
        res.status(400).json({message:"cant connect to db"});
        return;
    }

    getEventsFromDb().then(()=>{
        res.status(200).json(events);
        return;
    }).catch(err=>{
        res.status(400).json('promise error');
        return;
    })

});

//delete-event/:id
//update-event/:id
app.post('/create-event', (req, res) => {

    const validateCreateEventInfo = (name, description, date, location, category, image) => {

        if(
            name.length < 1 || 
            description.length < 1 || 
            date.length < 1 ||
            location.length < 1 ||
            category.length < 1 ||
            image.length < 1
            ){
            return 0;
        }

        return 1;
    }

    if(!mydb) {
        res.status(400).json("unable to connect to db");
        return;
    }

    getEventsFromDb().then(()=>{

        let { name, description, date, location, category, image } = req.body;

            if(validateCreateEventInfo(name, description, date, location, category, image)){

                let doc = { 
                    name,
                    description,
                    date,
                    location,
                    image,
                    category,
                    "selector": {
                        "type": "event"
                    }
                };

                mydb.insert(doc, function(err, body, header) {
                    if (err) {
                    res.status(400).json({message:"unable insert event"});
                    return;
                    }
                    res.status(200).json({message:"event was inserted successfully"});
                    return;
                });
            }else{
                res.status(400).json({message:"unable to insert event - invalid inputs"});
                return;
            }

    }).catch(err=>{
        res.status(400).json('promise error');
        return;
    })

});

app.post('/register', (req, res) => {

    const validateUserRegisterInfo = (name, password, email, usersInDb) => {

        if(name.length < 1 || password.length < 1 || email.length < 1){
            return 0;
        }

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(String(email).toLowerCase())){
            return 0;
        }

        for(let i = 0; i < usersInDb.length; i++){
            if(usersInDb[i].email === email){
                return 0;
            }
        }

        return 1;
    }

    if(!mydb) {
        res.status(400).json("unable to connect to db");
        return;
    }

    getUsersfromDb().then(()=>{

        let { name, email, password} = req.body;

            if(validateUserRegisterInfo(name, password, email, registeredUsers)){

                let doc = { 
                    name,
                    "password": bcrypt.hashSync(password),
                    email,
                    "selector": {
                        "type": "user"
                    }
                };

                mydb.insert(doc, function(err, body, header) {
                    if (err) {
                    res.status(400).json({message:"unable to register user"});
                    return;
                    }
                    res.status(200).json({message:"user registered successfully"});
                    return;
                });
            }else{
                res.status(400).json({message:"unable to register user - invalid inputs"});
                return;
            }

    }).catch(err=>{
        res.status(400).json('promise error');
        return;
    })

});

app.post('/login', (req, res) => {

    let { email, password } = req.body;

    const validateUserLoginInfo = (password, email, usersInDb) => {

        if(password.length < 1 || email.length < 1){
            return 0;
        }

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(String(email).toLowerCase())){
            return 0;
        }

        for(let i = 0; i < usersInDb.length; i++){
            if(usersInDb[i].email === email){

                if(bcrypt.compareSync(password, usersInDb[i].password)){
                    return usersInDb[i]._id;
                }
            }
        }

        return 0;
    }

    getUsersfromDb().then(()=>{
            const loginValue = validateUserLoginInfo(password, email, registeredUsers);
            if(loginValue !== 0){
                const loginInfo = {
                    userId: loginValue
                }
                res.json(loginInfo);
            }else{
                res.status(400).json({message:"uunable to login user - invalid inputs"});
                return;
            }

    }).catch(err=>{
        res.status(400).json({message:"promise error"});
        return;
    })

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
