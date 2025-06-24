const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dataFile = path.join(__dirname, 'data.json');

app.use(bodyParser.json());

function readData() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (e) {
    return { menu: [], orders: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// Login endpoint (dummy)
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  res.json({ userId: username });
});

// Get menu
app.get('/api/menu', (req, res) => {
  const data = readData();
  res.json(data.menu);
});

// Upload menu (admin)
app.post('/api/menu', (req, res) => {
  const { menu } = req.body; // expect array of {meal: '', desc: ''}
  const data = readData();
  data.menu = menu;
  writeData(data);
  res.json({ status: 'ok' });
});

// Submit order
app.post('/api/order', (req, res) => {
  const { userId, meals } = req.body;
  const data = readData();
  // avoid duplicate
  data.orders = data.orders.filter(o => o.userId !== userId);
  data.orders.push({ userId, meals });
  writeData(data);
  res.json({ status: 'ok' });
});

// Statistics
app.get('/api/stat', (req, res) => {
  const data = readData();
  const stat = {};
  data.orders.forEach(o => {
    o.meals.forEach(m => {
      stat[m] = (stat[m] || 0) + 1;
    });
  });
  res.json(stat);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
