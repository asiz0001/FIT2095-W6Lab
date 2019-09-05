let express = require('express');
let ejs = require("ejs");
let bodyParser = require('body-parser');
let mongodb = require('mongodb');
let app = express();

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.static("img"));
app.use(express.static("css"));

app.use(bodyParser.urlencoded({
    extended: false
}));

let client = mongodb.MongoClient;
let url = "mongodb://localhost:27017/";
let db, col;

client.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    db = client.db('week6lab');
    col = db.collection('tasks');
});

app.get("/", function(req,res) {
    res.render("index.html");
});

app.get("/newtask", function(req,res) {
    res.render("newtask.html");
});

app.get("/listtasks", function(req,res) {
    col.find({}).toArray(function(err,data) {
        res.render("tasklist.html", {tasks: data});
    });
});

app.get("/deleteall", function(req,res) {
    res.render("deleteall.html");
});

app.get("/deletetask", function(req,res) {
    res.render("deletetask.html");
});

app.get("/updatetask", function(req,res) {
    res.render("updatetask.html");
});

app.post("/add", function(req,res) {
    let randomID = Math.round(Math.random() * 1000);
    let d = new Date(req.body.due);
    let newTask = {taskID: randomID, name: req.body.name, assignedTo: req.body.assignedTo, due: d, status: req.body.status, desc: req.body.desc};
    
    col.insertOne(newTask);

    res.redirect("/listtasks");
});

app.post("/clear", function(req,res) {
    let query = {status: "Complete"}
    col.deleteMany(query, function(err, obj) {});
    
    res.redirect("/listtasks");
});

app.post("/delete", function(req,res) {
    let id = parseInt(req.body.taskID);
    query = {taskID: id};

    col.deleteMany(query, function(err, obj) {});
    
    res.redirect("/listtasks");
});

app.post("/update", function(req,res) {
    let id = parseInt(req.body.taskID);
    let status = req.body.status;
    query = {taskID: id};

    col.updateMany(query, {$set: {status: status} } ,function(err, obj) {});
    
    res.redirect("/listtasks");
});

app.listen(8080);