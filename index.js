import express from "express";
import bodyParser from "body-parser";
import pg from 'pg'

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const db=new pg.Client({
user:"postgres",
host:"localhost",
database:"World",
password:"postgre@123",
port:5432
});


db.connect();

let datatobesent=[];

const result=await db.query("Select country_code from visited_countries");


app.get("/",async(req,res)=>{
result.rows.forEach((data)=>{
  datatobesent.push(data.country_code);
})
  res.render("index.ejs",{countries:datatobesent,total:result.rowCount})
});


app.post("/add",async(req,res)=>{
   const country_name=req.body["country"];
   let country_code;
   try {
    country_code=await db.query("Select country_code from countries where country_name = $1",[country_name]);
   } catch (error) {
    console.log(error);
   }
   if(country_code.rows.length!=0)
   {
    const data=result.rows[0];
    const countryCode=data.country_code;
    await db.query("insert into visted_countries(country_code) values=$1",[countryCode])
   res.redirect("/")
   }
});

app.get("/add",async(req,res)=>{
  res.redirect("/");
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
