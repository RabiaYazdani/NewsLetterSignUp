import express from "express";
import bodyParser from "body-parser";
import mailchimp from "@mailchimp/mailchimp_marketing";
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
import { fileURLToPath } from 'url';
import  { dirname } from 'path';
const __fileUrl = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileUrl);
app.listen(process.env.PORT || 3000);// dynamic port help servers to decide which port should be seleted
const apikey = "826a9b0c57b4a749462dd540765dbcc0-us20";
// we use this command to use the content that is not on the internet and is residing on the code side
// like local css and images and other necessary files in the system. 
// we make them public so when the app go live it can access the data avaiable in the public folder which in 
// our case is a css stylesheet and an image
app.use(express.static("public"));
mailchimp.setConfig({
    apiKey: apikey,
    server: "us20",
});
async function checkConnection() {
    const response = await mailchimp.ping.get();
    console.log(response);
  }
  checkConnection();
  
app.get("/",function(req,res){
   res.sendFile(__dirname + "/Signup.html");
});

app.post("/Failure",function(req,res){
res.redirect("/");
})

app.post("/",function(req,res){
  const subscribingUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  };
async function sendData (){
   const listId = "e3fd95ad8d";
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/Success.html");
     }
     else
     {
       res.sendFile(__dirname + "/Failure.html");
     }}
     sendData();
 
})





