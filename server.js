const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const hotelsRouter = require('./routes/hotels');
const roomsRouter = require('./routes/rooms');



app.use(express.json());
app.use(cors());

app.use('/api/hotels', hotelsRouter);
app.use('/api/rooms', roomsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.get('/', (req, res) => {
  res.send('Hotel Management API');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

