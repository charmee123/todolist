//jshint esversion:6
const express = require("express"); //in starting
const bodyParser = require("body-parser"); //in starting
const mongoose = require("mongoose");
const _ = require("lodash");
// const date= require(__dirname + "/date.js");


const app = express(); //in starting

// const items =["Buy food", "Cook food", "Eat food"];
// const workItems=[];

app.set("view engine", "ejs"); //it is very imp to paste this line below app=express()

//setting up body Parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public")); //using css in server based website

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://charmeegandhi0:Spam%402003@cluster0.zndvuqy.mongodb.net/todolistDB');
  console.log("connected");
}

const itemSchema = new mongoose.Schema({
  name: String,
});

const Item = new mongoose.model("Item", itemSchema);
//creating new document
const item1 = new Item({
  name: "Welcome to your todo list!"
});
const item2 = new Item({
  name: "Hit the + button to add anew item. "
});
const item3 = new Item({
  name: "<-- Hit this to delete an item."
});
const defaultItems = [item1, item2, item3];
// Item.insertMany([item1 , item2, item3]).then(function(){
//   console.log("Successfully saved all the items to database");
// }).catch(function(error){
//   console.log("error");
// });
const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) { // in starting

  Item.find({}).then(function(foundItems) {

      if (foundItems.length === 0) {
        Item.insertMany(defaultItems).then(function() {
          console.log("Successfully saved all the items to database");
        }).catch(function(error) {
          console.log("error");
        });
        res.redirect("/");
      } else {
        // const day= date.getDate();
        res.render("list", {
          listTitle: "Today",
          newListItems: foundItems
        });
      }
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({
    name: customListName
  }).then(function(foundList) {
    if (!foundList) {
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      console.log("saved");
      res.redirect("/" + customListName);
    } else {
      res.render("list", {
        listTitle: foundList.name,
        newListItems: foundList.items
      });
    }
  }).catch(function(error) {
    console.log(error)
  });

  // const list = new List({
  //   name: customListName,
  //   items: defaultItems
  // });
  // list.save();

});

app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  // if (req.body.list==="Work"){
  //   workItems.push(item);
  //   res.redirect("/work")
  // }else{
  //   items.push(item);
  //   res.redirect("/");        //when post request is triggered then it will redirect to homepage
  // }

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save(); //shortcut used to save items in the collection
    res.redirect("/"); //redirecting to homepage after saving the items
  } else {
    List.findOne({
      name: listName
    }).then(foundList => {
      foundList.items.push(item)
      foundList.save()
      res.redirect("/" + listName)
    }).catch(err => {
      console.log(err);
    });
  }
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId).then(function() {
        console.log("Successfully deleted item.");
      })
      .catch(function(error) {
        console.log("error");
      });
    res.redirect("/");
  } else {

    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItemId
        }
      }
    }).then(function(foundList) { //here  findoneandupdate(condition,update,callback)

      res.redirect("/" + listName);

    });

  }

  // Item.findByIdAndRemove(checkedItemId).then(function() {
  //     console.log("Successfully deleted item.");
  //   })
  //   .catch(function(error) {
  //     console.log("error");
  //   });
  // res.redirect("/");
});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  })
});

app.get("/about", function(req, res) {
  res.render("about");
});
// app.post("/work", function(req,res){
//   let item=req.body.newItem;
//   workitems.push(item);
//   res.redirect("/work");
// });


app.listen(3000, function() { //in starting
  console.log("Server started on port 3000");
});
