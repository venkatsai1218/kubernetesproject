const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'social_app'
});

// Registration route
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;

        // Insert user into the database
        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(sql, [username, hash], (err, result) => {
            if (err) throw err;
            res.send('User registered successfully!');
        });
    });
});

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.send('User not found.');
        }

        const user = result[0];

        // Compare the password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
                res.send(`Welcome to Sai's social media platform, ${user.username}!`);
            } else {
                res.send('Invalid credentials.');
            }
        });
    });
});

module.exports = router;
