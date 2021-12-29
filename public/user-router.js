const { response } = require('express');
let express = require('express');
let router = express.Router();
const mc = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
let app = express();



//get request for loading specific users from the query param name
router.get("/",loadSpecificUsers);
//post request for registering a new user 
router.post("/",registerNewUser);

//get request for specific user 
router.get("/:id", getUser);
//post request for changing the privacy
router.put("/:id",privacyChange);


//load specific users from query params
function loadSpecificUsers(req,res,next){

    console.log("Query");
    console.log(req.query.name);
  

    if (req.query.name==undefined){

        req.app.locals.db.collection("users").find({"privacy":false}).toArray(function(err, result){
            if(err){
                res.status(500).end("Error reading users.");
                console.log(err);
                return;
            }
            console.log(result);
            
            res.render("users",{users:result,status:req.session.loggedin,
                id:req.session.sessionID,username:req.session.username})
            next();
            return;
        });	

    }
    else{

        let name=req.query.name;

        query={'$regex':name, '$options':'i'};
        req.app.locals.db.collection("users").find({ username : query , "privacy":false}).toArray(function(err, result){
            if(err){
                res.status(500).send("Error reading users.");
                console.log(err);
                return;
            }
            console.log(result);
            res.render("users",{users:result,status:req.session.loggedin,id:req.session.sessionID,
                username:req.session.username})
            next();
            return;
        });	

    }
    
}

//registers new user
function registerNewUser(req,res,next){

    var username = req.body.username;
    var password = req.body.password;
    let user={};
    user.username=username;
    user.password=password;
    user.privacy=false;
    
    
    req.app.locals.db.collection("users").findOne({"username":username}, function(err,result){
        if (result!=null && result.username==user.username){
            let userpresent='true';
            res.status(500).render("register.pug",{present:userpresent});
        }
        else{
            req.app.locals.db.collection("users").insertOne(user,function(err,result){
                if (err){
                    res.status(500).send("Error: Could not update the new user");
                }
                console.log(user);
                res.status(200);
                req.session.loggedin = true;
                req.session.username = username;
                req.session.privacy=false;
                
                req.app.locals.db.collection("users").findOne({"username":username},function(err,result){
                    if (err){
                        res.status(500).send("Could not find the user");
                    }
                    req.session.sessionID=result["_id"];
                    res.redirect('/users/'+req.session.sessionID);
                });
    
            });

        }
        
    });


}

//get a specific user
function getUser(req,res,next){

    
    let id = req.params.id;	
	console.log(id);

	//We can create an ObjectID version:
	let oid = new ObjectID(id);

    //storing the orders to access them later
    req.app.locals.db.collection("orders").find().toArray(function(err,foodOrders){  
        if (err){
            res.status(500).end("Could not access orders");
            return;
        }
        console.log("Here");
        console.log(foodOrders);
        req.app.locals.orders=foodOrders;
    });

    req.app.locals.db.collection("users").findOne({"_id": oid}, function(err, result){
        if(err){
            console.log(err);
            res.status(500).end("Error reading user.");
            return;
        }
        
        if(!result){
            res.status(404).end("Could not find a user with that ID");
            return;
        }
        
        if (result.privacy==true && req.app.locals.loggedin==false){
            res.status(403).send("User profile private and not logged in");
        }
        
        else if ((result.privacy==false || result.privacy==true) && req.session.loggedin==true && req.session.username==result.username){
            console.log("Current user");
            res.status(200).render("userprofile",
            {
                username:req.session.username,
                particularUser:result.username,
                id:req.session.sessionID,
                status:req.session.loggedin,
                orders:req.app.locals.orders
            });
        }
        else if (result.privacy==false && req.session.username!=result.username){
            res.status(200).render("ordersummary",
            {   username:req.session.username,
                particularUser:result.username,
                id:req.session.sessionID,
                status:req.session.loggedin,
                orders:req.app.locals.orders
            });
        }
        next();
    });
}


//handles the privacy change request
function privacyChange(req,res,next){

    let id=req.params.id;

    let oid=ObjectID(id);
    console.log("Body");
    console.log(req.body);
    let featured;
    if (req.body.selectedValue=='true'){
        featured=true;
    }
    else if(req.body.selectedValue=='false'){
        featured=false;
    }

    
        
    req.app.locals.db.collection("users").updateOne({"_id":oid}, {$set: {privacy: featured}}, function(err,result){
        if (err){
            res.status(500).send("Unable to update privacy change");
        }
        console.log("Updated status:");
        console.log(result);
        //res.status(200).redirect("/users/"+req.session.sessionID);
        res.status(200).send(String(id));
    });
        
    
}

module.exports = router;
