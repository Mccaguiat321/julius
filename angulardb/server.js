const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');
const escpos = require('escpos');  // Ensure escpos is correctly imported
const { SerialPort } = require('serialport'); // Correct import for serialport

const app = express();
const port = 3000;

// CORS options
const corsOptions = {
  origin: 'http://localhost:4200', // Allow requests from Angular app
  credentials: true,              // Allow cookies and session data
};

// Middleware configuration
app.use(cors(corsOptions)); 
app.use(bodyParser.json());

// Session configuration
app.use(session({
  secret: 'your-secret-key', // Replace with a more secure secret in production
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,  // Set to true when using HTTPS
    httpOnly: true, // Prevent JavaScript access to cookies
  },
}));

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',   // Set a proper password here
  database: 'angular',
});

// Serial port setup
const portName = 'COM3'; // Serial port name (make sure COM3 is correct for your system)
const baudRate = 9600;   // Baud rate


let serialPort;
let printer;

// Create the SerialPort instance and pass it to escpos
try {
  serialPort = new SerialPort({ path: portName, baudRate: baudRate });

  serialPort.on('open', () => {
    console.log('Printer connection established successfully.');
    // Initialize the printer once the port is open
    printer = new escpos.Printer(serialPort);
  });

  serialPort.on('error', (err) => {
    console.error('Error with the printer connection:', err.message);
  });

} catch (err) {
  console.error('Failed to initialize printer:', err.message);
  process.exit(1); // Stop the app if printer initialization fails
}

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the database');
});

// Print receipt endpoint
app.post('/print', (req, res) => {
  try {
    if (!printer) {
      console.error('Printer is not initialized or connection failed.');
      return res.status(500).json({ error: 'Failed to create printer connector.' });
    }

    // Get data from the request body
    const { queueNumber, patientName, appointmentTime, doctorName, department } = req.body;

    if (!queueNumber || !patientName || !appointmentTime || !doctorName || !department) {
      return res.status(400).json({ error: 'Missing required data in the request.' });
    }

    // Print queue receipt
    printer
      .text("==== QUEUE RECEIPT ====")
      .text("Patient: " + patientName)
      .text("Queue No: " + queueNumber)
      .text("Appointment Time: " + appointmentTime)
      .text("Doctor: " + doctorName)
      .text("Department: " + department)
      .text("------------------------")
      .text("Please wait for your turn.")
      .text("Once called, proceed to the designated counter.")
      .text("------------------------")
      .text("Thank you!")
      .cut()
      .close();

    res.json({ message: 'Queue receipt printed successfully!' });
  } catch (error) {
    console.error('Error during printing:', error.stack);
    res.status(500).json({ error: 'Failed to print', details: error.message });
  }
});





app.post('/api/register', async (req, res) => {
  const { name, age, password } = req.body;

  // Check for required fields
  if (!name || !age || !password) {
    return res.status(400).json({ message: 'Name, age, and password are required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO user (name, age, password) VALUES (?, ?, ?)';
    db.query(sql, [name, age, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ message: 'Error inserting data' });
      }
      res.status(200).json({ message: 'Registration successful', result });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ message: 'Error processing request' });
  }
});






app.post('/api/inserts', (req, res) => {
  const { expensestitle, budget, userId } = req.body;

  // Check for required fields
  if (!expensestitle || !budget || !userId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = 'INSERT INTO title_expense (use_id, title_of_expenses, budget) VALUES (?, ?, ?)';
  db.query(sql, [userId, expensestitle, budget], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Error inserting data' });
    }
    res.status(200).json({ message: 'Data inserted successfully', result });
  });
});



app.post('/api/expenses_insert', (req, res) => {
  const { name, cost, itemId } = req.body;
  if (!name || !cost || !itemId) {
    return res.status(400).json({ message: 'Name, Cost, and Item ID are required fields' });
  }
  const sql = 'INSERT INTO expenses (the_expenses, cost, t_id) VALUES (?, ?, ?)';
  db.query(sql, [name, cost, itemId], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Error inserting data' });
    }
    const fetchSql = 'SELECT * FROM expenses';
    db.query(fetchSql, (fetchErr, fetchResult) => {
      if (fetchErr) {
        console.error('Error fetching data:', fetchErr);
        return res.status(500).json({ message: 'Error fetching updated data' });
      }

      res.status(200).json(fetchResult);  // Return the updated data list
    });
  });
});






app.put('/api/update/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).json({ message: 'Name and age are required fields' });
  }

  const sql = 'UPDATE user SET name = ?, age = ? WHERE id = ?';
  db.query(sql, [name, age, userId], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).json({ message: 'Error updating data' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  });
});


app.put('/update_expenses/:id', (req, res) => {
  const expenseId = parseInt(req.params.id);  // Corrected from userId to expenseId
  const { name, cost } = req.body;

  if (!name || !cost) {
    return res.status(400).json({ message: 'Name and cost are required fields' });
  }

  const sql = 'UPDATE expenses SET the_expenses = ?, cost = ? WHERE id = ?';
  db.query(sql, [name, cost, expenseId], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).json({ message: 'Error updating data' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense updated successfully' });
  });
});



app.put('/api/update_title_expense/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { expensestitle, budget } = req.body;

  if (!expensestitle || !budget) {
    return res.status(400).json({ message: 'Title and budget are required fields' });
  }
  const sql = 'UPDATE title_expense SET title_of_expenses = ?, budget = ? WHERE id = ?';
  db.query(sql, [expensestitle, budget, userId], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).json({ message: 'Error updating data' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Record updated successfully' });
  });
});




app.delete('/api/delete_from_title_expense/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const sql = 'DELETE FROM title_expense WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error deleting data' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  });
});
app.delete('/delete_expenses/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const sql = 'DELETE FROM expenses WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error deleting item' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  });
});





app.delete('/api/delete/:id', (req, res) => {
  const userId = parseInt(req.params.id);

  const sql = 'DELETE FROM user WHERE id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).json({ message: 'Error deleting data' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// Get items with search functionality
app.get('/items', (req, res) => {
  let search = req.query.search || '';
  let sql = `SELECT * FROM user WHERE name LIKE ? OR id LIKE ? OR age LIKE ?`;
  
  // Prepare the search parameters to match the wildcard search
  const searchParams = [`%${search}%`, `%${search}%`, `%${search}%`];

  db.query(sql, searchParams, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});
app.get('/title_expenses', (req, res) => {
  const search = req.query.search || '';
  const page = parseInt(req.query.page) || 1; // Default to page 1 if no page is provided
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  const offset = (page - 1) * limit;

  const query = `
    SELECT 
      te.id,
      te.title_of_expenses,
      te.budget,
      SUM(e.cost) AS total_cost,
      COUNT(te.id) OVER() AS total_items
    FROM title_expense te
    LEFT JOIN expenses e ON e.t_id = te.id
    WHERE (te.title_of_expenses LIKE ? OR te.id LIKE ? OR te.budget LIKE ?)
    AND te.use_id = ?
    GROUP BY te.id
    LIMIT ? OFFSET ?
  `;

  const params = [`%${search}%`, `%${search}%`, `%${search}%`, userId, limit, offset];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    const totalItems = results.length > 0 ? results[0].total_items : 0;
    res.json({
      titleExpenses: results,
      totalCost: results.reduce((sum, row) => sum + (row.total_cost || 0), 0),
      totalItems: totalItems
    });
  });
});


app.get('/expenses', (req, res) => {
  const search = req.query.search || '';
  const itemId = req.query.itemId; // Get itemId from query parameters
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  if (!itemId) {
    return res.status(400).json({ message: 'Item ID is required.' });
  }

  const sql = `
    SELECT * 
    FROM expenses 
    WHERE (the_expenses LIKE ? OR id LIKE ? OR cost LIKE ?)
    AND t_id = ?
  `;

  // Escape the search term to prevent SQL injection
  const searchParams = [`%${search}%`, `%${search}%`, `%${search}%`, itemId];

  db.query(sql, searchParams, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});


// Route: Login
app.post('/login', (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  db.query('SELECT * FROM user WHERE name = ?', [name], async (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: 'Incorrect password' });
      }

      req.session.userId = user.id;

      return res.status(200).json({
        message: 'Login successful',
        userId: user.id,
        userName: user.name  // Add the user's name here
      });
    } catch (err) {
      console.error('Password comparison error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });
});
app.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to destroy session');
    }
    // Clear the session cookie
    res.clearCookie('connect.sid');
    return res.status(200).send('Logged out successfully');
  });
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
