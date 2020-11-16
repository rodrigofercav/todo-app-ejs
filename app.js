//jshint esversion:6

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

//-- MongoDB connection
mongoose.connect(
    "mongodb+srv://" +
    process.env.MONGO_USER + ":" +
    process.env.MONGO_PASS + "@" +
    process.env.MONGO_URL + "/" +
    process.env.MONGO_DB +
    "?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
);

//-- Items rsList Schema
const itemsSchema = new mongoose.Schema({
    description: String,
    status: Boolean,
    createdAt: Date,
    doneAt: Date
});

const Item = mongoose.model("Item", itemsSchema);

//- App
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

//- Routes
app.get('/', (req, res) => {
    Item.find({ status: false }, (err, items) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(items);
            res.render("list", {
                currentDate: (new Date()),
                todoList: items
            });
        }
    });
});

app.post("/checkItem", (req, res) => {
    Item.findOneAndUpdate(
        { _id: req.body.checkboxItem },
        { status: true, doneAt: new Date() }, 
        null,
        (err, res) => {
            if (err) {
                console.log("Error: " + err);
            } else {
                console.log("Successfully checked as done.")
                console.log("Original Document: ", res);
            }
        });
    res.redirect('/');
});

app.post("/", (req, res) => {
    const newItem = new Item({
        description: req.body.newTodo,
        status: false,
        createdAt: new Date(),
        doneAt: null
    });
    newItem.save();
    res.redirect("/");
});

//-- 404 Route (must be the last route)
app.get('*', function (req, res) {
    res.status(404).render('error404');
});

//- Up server
app.listen(process.env.SERVER_PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${process.env.SERVER_PORT}.`);
});
