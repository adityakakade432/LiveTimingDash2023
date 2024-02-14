import express from 'express';
import { Client } from 'pg';
import bodyParser from 'body-parser';

export const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Connecting to Heroku Postgres Database, opening a connection.
const client = new Client({
  connectionString: "postgres://rinyiqfqetfjlt:1ec06fe79448a64d62b68d775ff54" +
    "ca6c59b3a6b039413cc79b1358bac0a9ebb@ec2-54-164-40-66.compute-1." +
    "amazonaws.com:5432/db3r147geq1l78",
  ssl: { rejectUnauthorized: false }
})

client.connect((err) => {
  if (err) {
    console.log(err)
  }
})

//Getting timestamp at time of function call.

const now = new Date();

//Endpoints begin here.
app.get('/test', (_, res) =>
  res.json({ greeting: "The Live Timing Dash server is up and slaying, bitch!" }
  ))

//POST ENDPOINTS----------------------------------------------------------------

//Insert new values from the left & right rpm sensors into rpm_data_new.
app.post('/insert/rpm', (req, res) => {
  client.query("INSERT INTO rpm_data_new(left_rpm, right_rpm, time_stamp) " +
    "VALUES ($1, $2, $3)",
    [req.body.left_rpm, req.body.right_rpm, now],
    (err) => {
      if (err) {
        console.log(err)
      } else {
        res.send(req.body)
      }
    })
})

//Insert new values from the potentiometer into potent_data_new.
app.post('/insert/potent', (req, res) => {
  client.query("INSERT INTO potent_data_new(potentiometer, time_stamp)" +
    " VALUES ($1, $2)",
    [req.body.potentiometer, now],
    (err) => {
      if (err) {
        console.log(err)
      } else {
        res.send(req.body)
      }
    })
})

//Insert new values from the temperature sensor into temperature_data_new.
app.post('/insert/temp', (req, res) => {
  client.query("INSERT INTO temperature_data_new(temp, time_stamp)" +
    " VALUES ($1, $2)",
    [req.body.temp, now],
    (err) => {
      if (err) {
        console.log(err)
      } else {
        res.send(req.body)
      }
    })
})

//Insert new values from the accelerometer into accel_data_new.
app.post('/insert/accel', (req, res) => {
  client.query("INSERT INTO accel_data_new(accel, time_stamp) VALUES ($1, $2)",
    [req.body.accel, now],
    (err) => {
      if (err) {
        console.log(err)
      } else {
        res.send(req.body)
      }
    })
})

//Insert new values from the gps into gps_data_new.
app.post('/insert/gps', (req, res) => {
  client.query("INSERT INTO gps_data_new(lat, long, time_stamp)" +
    " VALUES ($1, $2, $3)",
    [req.body.lat, req.body.long, now],
    (err) => {
      if (err) {
        console.log(err)
      } else {
        res.send(req.body)
      }
    })
})

//Makes sure that the process uses vite, listens on the local port specified.
//This function is for local testing (use with postman)!
if (!process.env['VITE']) {
  const frontendFiles = process.cwd() + '/dist'
  app.use(express.static(frontendFiles))
  app.get('/*', (_, res) => {
    res.send(frontendFiles + '/index.html')
  })
  app.listen(process.env['PORT'])
}
