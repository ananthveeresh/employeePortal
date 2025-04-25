const dbConfig = require("../config/db.mongo.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
db.con = mongoose.connection

//db.questionmaster = require("./questionmaster.js")(mongoose);
db.eventcategory = require("./eventcategory.js")(mongoose)
db.autoIncrement = require("./autoincrement.js")(mongoose);
db.homework = require("./homework.js")(mongoose);
db.examcategory = require("./examcategory.js")(mongoose)
db.subject = require("./subjects.js")(mongoose)
db.studentstatus = require("./studentstatus.js")(mongoose)
db.notifications = require("./notifications.js")(mongoose)
db.gradescale = require("./gradescale.js")(mongoose)
db.exammarks = require("./exammarks.js")(mongoose)
db.reportlayouts = require("./reportlayouts.js")(mongoose)


module.exports = db;
