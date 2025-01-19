//file to insert all data from data.js to database
const mongoose=require("mongoose");
const initData= require("./data.js");
const Listing= require("../models/listing.js");

const mongoUrl="mongodb://127.0.0.1:27017/wanderlust";

 main().then(()=>{
    console.log("connected to DB");
 })
 .catch((err)=>{
    console.log(err);
 });
async function main(){
    await mongoose.connect(mongoUrl);
}

    const initDB= async ()=>{
        //Listing.deleteMany({});
        initData.data = initData.data.map((obj) =>({ ...obj , owner:'678ac3d3b864d62ae5ef26f0' })); //map function will not change array it will just add owner object in it and ...obj means object which was earlier in listing schema 
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
  }

 initDB();
