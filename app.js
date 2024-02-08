// app.js

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());

// MySQL Database Connection Configuration
const dbConfig = {
    host: 'localhost', 
    user: 'root', 
    password: '#####', 
    database: '#######'
};

const connection = mysql.createConnection(dbConfig);

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Create a table if not exists
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
  )`;

  
connection.query(createTableQuery, (err) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table created or already exists');
  }
});

// CRUD operations
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const insertQuery = 'INSERT INTO users (name, email) VALUES (?, ?)';
  connection.query(insertQuery, [name, email], (err, result) => {
    if (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ id: result.insertId, name, email });
    }
  });
});

app.get('/users', (req, res) => {
  const selectQuery = 'SELECT * FROM users';
  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const selectQuery = 'SELECT * FROM users WHERE id = ?';
  connection.query(selectQuery, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json(results[0]);
      }
    }
  });
});

app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  const updateQuery = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  connection.query(updateQuery, [name, email, userId], (err) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ id: userId, name, email });
    }
  });
});

app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const deleteQuery = 'DELETE FROM users WHERE id = ?';
  connection.query(deleteQuery, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({ message: 'User deleted successfully' });
      }
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
