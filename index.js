const express = require("express");
const bodyParser = require('body-parser');


const password = "mdhamim54321";
const { MongoClient } = require('mongodb');
const ObjectId =  require('mongodb').ObjectId;
const uri = "mongodb+srv://mdhamim:mdhamim54321@cluster0.wz6sa.mongodb.net/practice_data?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/",(req,res)=>{
    // res.send("Node is working")
    res.sendFile(__dirname + "/index.html");
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
const collection = client.db("practice_data").collection("products");

// ===================== READ Data from Database ====================
app.get("/products",(req,res)=>{
//--------- limited Data ,How many do i want to read -----------------
// collection.find({}).limit(2)  
  
  //------------------ read all Data ----------
  collection.find({})             
  .toArray((err,documents)=>{
    res.send(documents)
  })
})
//=================== POST Method with form (Create Data) ================
app.post("/addProduct",(req,res)=>{
  const product = req.body;
  collection.insertOne(product)
  .then(result=>{
      console.log("Data added successfully")
      res.redirect("/")
  })
})
//  ------------ locally-------------
//   const product = {name:"Football", price:500, quantity:20}
//   collection.insertOne(product)
//   .then(result=>{
//       console.log("One Data added")
//   })
//   console.log("Database connected successfully")

//==================== UPDATE DATA (Data load from Database & update it)====================
app.get("/product/:id",(req,res)=>{
  collection.find({_id: ObjectId(req.params.id)})
  .toArray((err,document)=>{
    res.send(document[0])
  })
})
// ------------update value------------
app.patch("/update/:id", (req,res)=>{
  collection.updateOne({_id: ObjectId(req.params.id)},
  { 
    $set: { price: req.body.price, quantity : req.body.quantity}
  })
  .then(result =>{
    res.send(result.modifiedCount > 0)
    console.log(result)
  })
})

// ===================== Delete from Database ===================
app.delete("/delete/:id", (req, res)=>{
  // console.log(req.params.id)
  collection.deleteOne({_id: ObjectId(req.params.id)})
  .then(result=>{
    res.send(result.deletedCount > 0)
  })
})



 
});




app.listen(3000);