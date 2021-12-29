const { response } = require('express');
let express = require('express');
let router = express.Router();
const mc = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;


//get request for specific user 
router.get("/:id", getOrder);

//post order
router.post("/",newOrder);

function getOrder(req,res,next){
    id=req.params.id;

    let oid=new ObjectID(id);

    req.app.locals.db.collection("orders").findOne({"_id":oid}, (function(err,result){
        if (err){
            res.status(500).send("Order not found");
        }
        console.log("Food order");
        //console.log(result);
        let item=Object.values(result.body.order);
        console.log(item);

        if (result.privacy==true && req.app.locals.loggedin==false){
            res.status(403).send("User profile private and not logged in. Cannot view the order");
        }
        else if(result.privacy==false || req.session.loggedin==true) {
            res.status(200).render("order",{ 
                username:req.session.username,  
                customername:result.username,
                restName:result.body.restaurantName,
                subtotal:result.body.subtotal.toFixed(2),
                fee:result.body.fee.toFixed(2),
                tax: result.body.tax.toFixed(2),
                delivery_fee:result.body.delivery_fee.toFixed(2),
                total:result.body.total.toFixed(2),
                items:item,
                status:req.session.loggedin,
                id: req.session.sessionID

            });
        }
        
    }));

}
    


function newOrder(req,res,next){
    let info={};
    console.log(req.body);
    let username=req.session.username;
    let privacy=req.session.privacy;
    let body=req.body;
    info={username,body,privacy}
    console.log(info);

    req.app.locals.db.collection("orders").insertOne(info,function(err,result){
        console.log(result);
        if (err){
            res.status(500).end("Could not add order");
        }
        else{
            res.status(200).end(JSON.stringify(req.body));
        }

    });
}


module.exports=router;
