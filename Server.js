const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();



// Create a connection to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
db.connect(err => {
  if (err) 
    {
    console.error('Error connecting to the database:', err);
    if (err.code === 'ECONNREFUSED') 
        {
        console.error('Connection refused. Please check if the MySQL server is running and the connection details are correct.');
        }
  }
  else 
  {
    console.log('Connected to the database');
  }
});

// Retrieve all patients
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving patients');
      return;
    }
    res.json(results);
  });
});

// Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving providers');
      return;
    }
    res.json(results);
  });
});

// Filter patients by First Name
app.get('/patients/:firstName', (req, res) => {
  const { firstName } = req.params;
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  db.query(query, [firstName], (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving patients');
      return;
    }
    res.json(results);
  });
});

// Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  const { specialty } = req.params;
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  db.query(query, [specialty], (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving providers');
      return;
    }
    res.json(results);
  });
});

// Listen to the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
  console.log('Sending message to browser....');

    app.get('/', (req, res) => {
        res.send('Server is running on http://localhost:3300');
    });
});