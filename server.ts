import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false }
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()) //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect();

//ROUTES

//post's

app.post("/newsquat", async (req, res) => {
  try {
    const { squat } = req.body
  console.log({squat})
  const dbres = await client.query("update onerm set squat = $1 WHERE username = 'sebwiggins'", [squat]);
  res.json(dbres.rows);
  } catch (error) {
    console.error(error)
  }
});

app.post("/newdeadlift", async (req, res) => {
  try {
    const { deadlift } = req.body
  console.log({deadlift})
  const dbres = await client.query("update onerm set deadlift = $1 WHERE username = 'sebwiggins'", [deadlift]);
  res.json(dbres.rows);
  } catch (error) {
    console.error(error)
  }
});

app.post("/newbench", async (req, res) => {
  try {
    const { bench } = req.body
  console.log({bench})
  const dbres = await client.query("update onerm set bench = $1 WHERE username = 'sebwiggins'", [bench]);
  res.json(dbres.rows);
  } catch (error) {
    console.error(error)
  }
});

//get's

app.get("/squat", async (req, res) => {
  try {
    console.log("connecting to db")
    console.log(dbConfig)
    const dbres = await client.query("select squat from onerm WHERE username ='sebwiggins'");
    res.json(dbres.rows); 
  } catch (error) {
    console.error(error)
    return res.status(400).send(error)
  }

});

app.get("/deadlift", async (req, res) => {
  const dbres = await client.query("select deadlift from onerm WHERE username ='sebwiggins'");
  res.json(dbres.rows);
});

app.get("/bench", async (req, res) => {
  const dbres = await client.query("select bench from onerm WHERE username ='sebwiggins'");
  res.json(dbres.rows);
});


//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw 'Missing PORT environment variable.  Set it in .env file.';
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
