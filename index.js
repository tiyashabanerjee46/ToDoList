require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const day = require(__dirname+"/date.js");
const mongoose = require("mongoose");
const lodash = require("lodash");
const app = express();

mongoose.connect("mongodb://localhost/blogDB",{useNewUrlParser:true, useUnifiedTopology:true});

const listschema = new mongoose.Schema({
    name:String
});

const List = mongoose.model("List", listschema);

const list1 = new List({name:"Yoga class"});
const list2 = new List({name:"Breakfast"});
const list3 = new List({name:"Study"});

const newTasks= [list1,list2,list3];

const itemschema = new mongoose.Schema({
    name:String,
    items:[listschema]
});

const Item = mongoose.model("Item",itemschema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.get("/", function(req,res){
    List.find(function(err,items){
    if(items.length == 0){
        List.insertMany(newTasks, function(err){
            if(err){
                console.log(err);
            }else{
                console.log("successfully inserted");
            }
        });
        res.redirect("/");
    }else{
        var Day = day.getday();
        res.render('list', {day: Day , task: items});
    }
    })
})

app.get("/:name", function(req,res){
    var urlname = lodash.capitalize( req.params.name);
    Item.findOne({name: urlname},function(err,result){
        if(result){

        res.render("list", {day: result.name, task:result.items});
        }else{

            const item = new Item({
                name: urlname,
                items: newTasks
            });
        
            item.save();
            res.redirect("/" + urlname);
        }
    })
    
})

app.post("/",function(req,res){
    var newTask = req.body.task;
    var urlname = req.body.button;
    var Day = day.getday();
    const newlist = new List({name: newTask});
    if(urlname == Day)
    {
        newlist.save();
        res.redirect("/");
        
    }
    else{
        Item.findOne({name: urlname},function(err,result){
            result.items.push(newlist);
            result.save();
            res.redirect("/"+ urlname);
           });
    };
    
});

app.post("/delete", function(req,res){
    var Day = day.getday();
    var checkboxId = req.body.checkbox;
    var listname = req.body.listName;
    if(listname === Day){
    List.remove({_id:checkboxId}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("item deleted");
            res.redirect("/");
        }
    });
    }else{
        Item.findOneAndUpdate({name:listname},{$pull:{items:{_id:checkboxId}}}, function(err,result){
            if(!err){
                res.redirect("/"+listname);
            }
        });
    }
});

app.listen(300, function(){
console.log("server started successfully");
})