const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const fs = require('fs');

// Configure multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Get all rooms for a hotel
router.get('/:hotelSlug', async (req, res) => {
  try {
    const { hotelSlug } = req.params;
    const { rows } = await db.query('SELECT hotel_slug, room_slug, room_title, bedroom_count, room_images FROM rooms WHERE hotel_slug = $1', [hotelSlug]);
    
    // Convert BYTEA to Base64 for each room's images
    const roomsWithImages = rows.map(room => ({
      ...room,
      room_images: room.room_images ? room.room_images.map(image => image.toString('base64')) : []
    }));
    
    res.status(200).json(roomsWithImages);
  } catch (error) {
    console.error('Error in GET /api/rooms/:hotelSlug:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Get a specific room
router.get('/:hotelSlug/:roomSlug', async (req, res) => {
  try {
    const { hotelSlug, roomSlug } = req.params;
    const { rows } = await db.query('SELECT * FROM rooms WHERE hotel_slug = $1 AND room_slug = $2', [hotelSlug, roomSlug]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }
    // Convert BYTEA to Base64 for each image
    rows[0].room_images = rows[0].room_images.map(image => image.toString('base64'));
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error in GET /api/rooms/:hotelSlug/:roomSlug:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Create a new room
router.post('/', upload.array('room_images', 5), async (req, res) => {
  try {
    const { hotel_slug, room_slug, room_title, bedroom_count } = req.body;
    
    // Read uploaded files and convert to BYTEA
    const room_images = req.files.map(file => {
      const img = fs.readFileSync(file.path);
      fs.unlinkSync(file.path); // Delete the file after reading
      return img;
    });

    const { rows } = await db.query(
      'INSERT INTO rooms (hotel_slug, room_slug, room_images, room_title, bedroom_count) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [hotel_slug, room_slug, room_images, room_title, bedroom_count]
    );

    // Convert BYTEA to Base64 for the response
    rows[0].room_images = rows[0].room_images.map(image => image.toString('base64'));
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error in POST /api/rooms:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

 
 

module.exports = router;