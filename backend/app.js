
const express = require('express');
const path = require('path');
const dotenv = require('dotenv')
require("./token/tokenfunctions")()
sha512 = require('js-sha512');
const baseurl = "/";
const app = express();

const customEnvPath = path.resolve(__dirname, '../', '.env');
dotenv.config({ path: customEnvPath });

// dotenv.config({ path: '.env' })
const port = process.env.PORT || 7700;


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();


    // if (req.get('AuthToken')) {
    //     const authtokeninfo = JSON.parse(req.get('AuthToken'));
    //     const authToken = { "email": authtokeninfo.email, "token": authtokeninfo.token };

    //     validateToken(authToken).then(function(result) {
    //         if (result.status === 200) {
    //           next();
    //         } else {
    //           res.status(401).json('Not a valid token');
    //         }
    //       })
    //       .catch(function(error) {
    //         res.status(500).json('Error validating token');
    //       });
    //   } else {
    //     if(req.get('x-aei-token')){
    //         createToken('ram@aditya.ac.in').then(function(result) {
    //             console.log(result);
    //         });

    //     }else{
    //       res.status(401).json('Missing token');
    //     }
    //   }
})

app.use(express.json({ limit: '50mb' }));


// ************* AbhyasV24 Junior Questionbank Sysytem **************** //

const autoincrement = require("./router/autoincrement.router")
app.use(baseurl + "autoincrement", autoincrement);

// const questionmaster = require("./router/questionmaster.router")
// app.use(baseurl + "questionmaster", questionmaster);

const eventcategory = require("./router/eventcategory.router")
app.use(baseurl + "eventcategory", eventcategory);

const homework = require("./router/homework.router")
app.use(baseurl + "homework", homework);

const examcategory = require("./router/examcategory.router")
app.use(baseurl + "examcategory", examcategory);

const subject = require("./router/subject.router")
app.use(baseurl + "subject", subject);

const studentstatus = require("./router/studentstatus.router")
app.use(baseurl + "studentstatus", studentstatus);

const notifications = require("./router/notification.router")
app.use(baseurl + "notifications", notifications);

const gradescalerouter = require("./router/gradescale.router")
app.use(baseurl + "gradescale", gradescalerouter);

const exammarksrouter = require("./router/exammarks.router")
app.use(baseurl + "exammarks", exammarksrouter);

const layoutsrouter = require("./router/layouts.router")
app.use(baseurl + "layouts", layoutsrouter);

app.get("/", (req, res) => {
    res.json({
        message: "Employee Portal API Working"
    })
})

app.listen(port, () => {
    console.log(`Employee Portal API Working Server up and running on port : http://localhost:${port}`)
})