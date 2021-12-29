let userNames = ["winnifred", "lorene", "cyril", "vella", "erich", "pedro", "madaline", "leoma", "merrill",  "jacquie"];
let users = [];

userNames.forEach(name =>{
	let u = {};
	u.username = name;
	u.password = name;
	u.privacy = false;
	users.push(u);
});

const express = require('express');
let app = express();
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;

MongoClient.connect("mongodb://localhost:27017/", function(err, client) {
  if(err) throw err;	

  db = client.db('a4');
  app.locals.db = db;
  
  app.locals.db.listCollections().toArray(function(err, result){
	 if(result.length == 0){
		app.locals.db.collection("users").insertMany(users, function(err, result){
			if(err){
				throw err;
			}
			
			console.log(result.insertedCount + " users successfully added (should be 10).");
			client.close();
		});
		return;
	 }
	 
        let numDropped = 0;
        let toDrop = result.length;
        result.forEach(collection => {
		app.locals.db.collection(collection.name).drop(function(err, delOK){
			if(err){
				throw err;
			}
			
			console.log("Dropped collection: " + collection.name);
			numDropped++;
			
			if(numDropped == toDrop){
				app.locals.db.collection("users").insertMany(users, function(err, result){
					if(err){
						throw err;
					}
					
					console.log(result.insertedCount + " users successfully added (should be 10).");
					client.close();
				});
			}
		});		
	 });
  });
});