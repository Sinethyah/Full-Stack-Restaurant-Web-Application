
//const { application } = require('express');
const express = require('express');
const session = require('express-session')
let app = express();


let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
const MongoDBStore = require('connect-mongodb-session')(session);
const ObjectID = require('mongodb').ObjectID;
let db;


let store = new MongoDBStore({
	uri: 'mongodb://localhost:27017/session_test',
	//collection where we want to store the session data in
	collection: 'mySessions'
});

//
app.use(session({ secret: 'some secret here', saveUninitialized: false, store: store}))


app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.static("views"));


app.use(express.json());
app.use(express.urlencoded({extended: true}));
let userRouter = require("./public/user-router");
app.use("/users", userRouter);
let orderRouter=require("./public/order-router");
app.use("/orders",orderRouter);


//home page
app.get("/", function(req,res,next){
	res.status(200).render("home.pug",{status:req.session.loggedin,
		id:req.session.sessionID,username:req.session.username});
});

//register
app.get("/register", function(req,res,next){
	
	res.status(200).render("register.pug");
	
});

//post request for login
app.post("/",login);

//get request for login
app.get("/login", function(req,res,next){
	if (req.session.loggedin==true){
		res.status(200).redirect('/');
	}
	else{
		res.status(200).render("login.pug");
	}
});




//login
function login(req,res,next){

    let username=req.body.username;
    let password=req.body.password;

    console.log("User credentials:");
    console.log("Username "+username);
    console.log("Pasword"+password);
	console.log("logged in status:"+req.session.loggedin);

	if(req.session.loggedin==true){
		res.status(200).send("Already logged in.");
		return;
	}


    req.app.locals.db.collection("users").findOne({"username" : username, "password":password} ,function(err,result){
		console.log(result);

        if (result==null || result==[] || err){
            res.status(500).send("Could not find user");
        }
		else{
			console.log("LOGGED IN");
			req.session.loggedin = true;
			req.session.username = username;
			req.session.privacy=result.privacy;
			req.session.sessionID=result["_id"];

			res.status(200).render("home",{username:username,id:req.session.sessionID,status:req.session.loggedin});
		}
        
    });
}

app.get("/logout",logout);
app.get("/orderform",orderform);

function orderform(req,res,next){
	res.status(200).render("orderform.pug",{username:req.session.username,status:req.session.loggedin,
	id:req.session.sessionID});

}


//renders orderform page            
function logout(req,res,next){

	if(req.session.loggedin){
		console.log("Logged out");
		req.session.loggedin = false;
		req.session.username = undefined;
		req.session.destroy();

		res.redirect('/');
	
	}else{
		res.status(200).send("You cannot log out because you aren't logged in.");
	}

}





// Initialize database connection
MongoClient.connect("mongodb://localhost:27017/", function(err, client) {
  if(err) throw err;

  //Get the a4 database
  db = client.db('a4');
  app.locals.db = db;


  // Start server once Mongo is initialized
  app.listen(3000);
  console.log("Listening on port 3000");
});
