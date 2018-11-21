const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const UUID = require("uuid");
const multer = require('multer')


const dbConnect = require('./_assets/db_connect');
let mydb = dbConnect();

/**
 * multer [START] - neotestovany zatial
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },

    filename: (req, file, cb) => {

        const newFilename = file.originalname;
        cb(null, newFilename);
    }
});

const upload = multer({
    storage
});

/**
 * multer [END]
 */

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());

/**
 * routes [START]
 */

app.get('/', (req, res) => {
    const eventShowAll = require('./modules/event/showAll');
    eventShowAll(mydb, req, res);
});

app.put('/update-event/:id', (req, res) => {
    const eventUpdate = require('./modules/event/update');
    eventUpdate(mydb, req, res);
})

app.put('/delete-event/:id', (req, res) => {
    const eventDelete = require('./modules/event/delete');
    eventDelete(mydb, req, res);
})

app.post('/share-event', (req, res) => {
    const eventShare = require('./modules/event/share');
    eventShare(mydb, req, res);
})

app.post('/create-event', (req, res) => {
    const eventCreate = require('./modules/event/create');
    eventCreate(mydb, req, res);
});

app.post('/register', (req, res) => {
    const userRegister = require('./modules/user/register');
    userRegister(mydb, req, res);
});

app.post('/login', (req, res) => {
    const userLogin = require('./modules/user/login');
    userLogin(mydb, req, res);
});

app.post('/save-image', upload.single('selectedFile'), (req, res) => {
    res.send();
});

/**
 * routes [END]
 */

app.listen(process.env.PORT || 3000, () => {
    console.log('app is running on port 3000');
});