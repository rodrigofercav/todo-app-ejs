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
        useUnifiedTopology: true
    }
);

//-- Items ToDo List Schema
const itemsSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean
    }
});

const Item = mongoose.model("Item", itemsSchema);

/* const item1 = new Item({
    description: "Acordar",
    status: true
});

const item2 = new Item({
    description: "Comer",
    status: false
});

const item3 = new Item({
    description: "Dormir",
    status: false
});

defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Default Items were successfully inserted.");
    }
}); */


//--
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {

    Item.find({}, (err, items) => {
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

app.post("/", (req, res) => {

    const newItem = new Item({
        description: req.body.newTodo,
        status: false
    });

    newItem.save()

    res.redirect("/");
});


//-- 404 Route (must be the last route)
app.get('*', function(req, res){
    res.status(404).render('error404');
  });
  
app.listen(3000, () => console.log('Server started on port 3000.'));
